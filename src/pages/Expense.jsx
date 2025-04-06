import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';
import expenseService from '../services/expenseService';
import './Expense.css';
import { format } from 'date-fns';
import Sidebar from "../components/Sidebar"; // Import Sidebar
import FloatingButton from "../components/FloatingButton"; // Import Floating Button

Modal.setAppElement('#root');

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editingExpenseIndex, setEditingExpenseIndex] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        date: '',
        amount: '',
    });
    const [viewData, setViewData] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [interimText, setInterimText] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [modalMode, setModalMode] = useState('manual');
    const [token, setToken] = useState(localStorage.getItem('token'));
     const [isExpanded, setIsExpanded] = useState(false); // Sidebar stat

    useEffect(() => {
        fetchExpenses();
    }, []);

    const formatDateForDisplay = (isoDateString) => {
        if (!isoDateString) return '';
        return format(new Date(isoDateString), 'yyyy-MM-dd');
    };

    const fetchExpenses = async () => {
        try {
            const fetchedExpenses = await expenseService.getExpenses(token);
            const formattedExpenses = fetchedExpenses.map(expense => ({
                ...expense,
                date: formatDateForDisplay(expense.date),
            }));
            setExpenses(formattedExpenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const openModal = (index = null) => {
        if (index !== null && expenses[index]) {
            setFormData({ ...expenses[index] });
            setEditingExpenseIndex(index);
        } else {
            setFormData({ description: '', category: '', date: '', amount: '' });
            setEditingExpenseIndex(null);
        }
        setModalMode('manual');
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setEditingExpenseIndex(null);
        setModalMode('manual');
        setIsUploading(false);
        setPreviewUrl('');
    };

    const closeViewModal = () => setViewModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpenseIndex !== null) {
                await expenseService.updateExpense(token, expenses[editingExpenseIndex]._id, formData);
            } else {
                await expenseService.addExpense(token, formData);
            }
            fetchExpenses();
            closeModal();
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const handleEdit = (index) => {
        openModal(index);
    };

    const handleDelete = async (index) => {
        try {
            await expenseService.deleteExpense(token, expenses[index]._id);
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleView = (index) => {
        setViewData(expenses[index]);
        setViewModalOpen(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            setPreviewUrl(URL.createObjectURL(file));
            setModalMode('scan');

            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                extractDataFromText(text);
            } catch (error) {
                console.error('OCR Error:', error);
            }

            setIsUploading(false);
        }
    };

    const extractDataFromText = (text) => {
        const lines = text.split('\n');
        let amount = '';
        let description = '';
        let category = '';
        let date = '';
        let extractedDate = '';

        lines.forEach(line => {
            let cleanedLine = line.trim()
                .replace(/[()]/g, '')
                .replace(/(\d+)o\b/gi, '$1' + '0')
                .replace(/o/g, '0');

            if (!description && cleanedLine.match(/^\d+\s+[A-Z\s]+\s+\d+$/)) {
                let itemMatch = cleanedLine.match(/^\d+\s+([A-Z\s]+)\s+\d+$/);
                if (itemMatch) {
                    description += (description ? ', ' : '') + itemMatch[1].trim();
                }
            }

            const dateMatch = cleanedLine.match(/\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\b/);
            if (dateMatch && !extractedDate) {
                extractedDate = formatDate(dateMatch[0]);
            }

            if (/total due|total|amount|balance|due|subtotal|payment/i.test(cleanedLine.toLowerCase())) {
                const numbers = cleanedLine.match(/\b\d{1,4}(?:[.,]\d{2})?\b/g);
                if (numbers) {
                    const validNumbers = numbers.map(num => parseFloat(num.replace(',', '')));
                    const maxAmount = validNumbers.length ? Math.max(...validNumbers) : 0;
                    if (maxAmount > 0) {
                        amount = maxAmount.toFixed(2);
                    }
                }
            }

            if (/food|coffee|restaurant|cake|meal|dinner|lunch|beverage|tax/i.test(cleanedLine.toLowerCase())) {
                category = "Food";
            } else if (/grocery|supermarket|mart|vegetables|fruits|store/i.test(cleanedLine.toLowerCase())) {
                category = "Grocery";
            } else if (/cinema|movie|ticket|theatre/i.test(cleanedLine.toLowerCase())) {
                category = "Movie Ticket";
            }
        });

        if (!category) {
            category = "Other";
        }

        setFormData(prevData => ({
            ...prevData,
            description: description || '',
            category: category || '',
            date: extractedDate || '',
            amount: amount || ''
        }));
    };

    const formatDate = (dateStr) => {
        const dateParts = dateStr.split(/\/|-/);
        if (dateParts.length === 3) {
            let month, day, year;
            if (dateParts[2].length === 4) {
                [month, day, year] = dateParts;
            } else if (dateParts[0].length === 4) {
                [year, month, day] = dateParts;
            } else {
                return '';
            }
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return '';
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'en-US';
        recognitionInstance.interimResults = true;
        recognitionInstance.maxAlternatives = 1;
        recognitionInstance.continuous = true;

        recognitionInstance.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setInterimText(interimTranscript);
            if (finalTranscript) {
                parseVoiceInput(finalTranscript);
                recognitionInstance.stop();
            }
        };

        recognitionInstance.onerror = (event) => {
            console.error("Speech recognition error detected:", event.error);
            setIsListening(false);
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        recognitionInstance.start();
        setIsListening(true);
        setRecognition(recognitionInstance);
        setModalMode('voice');
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    };

    const parseVoiceInput = (transcript) => {
        let amount = '';
        let description = '';
        let category = '';
        let date = '';

        const numberWords = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
            'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16,
            'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
            'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100, 'thousand': 1000,
            'lakh': 100000, 'crore': 10000000
        };

        const convertWordsToNumber = (words) => {
            let total = 0;
            let current = 0;

            words.forEach(word => {
                word = word.toLowerCase();
                if (numberWords[word]) {
                    if (word === 'hundred') {
                        current *= numberWords[word];
                    } else if (word === 'thousand' || word === 'lakh' || word === 'crore') {
                        total += current * numberWords[word];
                        current = 0;
                    } else {
                        current += numberWords[word];
                    }
                } else if (/\d+/.test(word)) {
                    current += parseInt(word, 10);
                }
            });

            total += current;
            return total;
        };

        const amountMatch = transcript.match(/\b(?:rs\.?|rupees)?\s?(\d{1,4}(?:[.,]\d{2})?)\b/i);

        if (amountMatch) {
            amount = parseFloat(amountMatch[1].replace(',', '')).toFixed(2);
        } else {
            const words = transcript.split(/\s+/);
            const wordsAmount = convertWordsToNumber(words);

            if (wordsAmount) {
                amount = wordsAmount.toFixed(2);
            }
        }

        const dateMatch = transcript.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s(\d{4}))?\b/i);
        if (dateMatch) {
            let day = dateMatch[1].padStart(2, '0');
            let month = {
                january: '01', february: '02', march: '03', april: '04',
                may: '05', june: '06', july: '07', august: '08',
                september: '09', october: '10', november: '11', december: '12'
            }[dateMatch[2].toLowerCase()];
            let year = dateMatch[3] || new Date().getFullYear();
            date = `${year}-${month}-${day}`;
        } else {
            const relativeDateMatch = transcript.match(/\b(today|yesterday|tomorrow|tonight|this morning|this evening|this afternoon)\b/i);
            if (relativeDateMatch) {
                let dateStr = relativeDateMatch[0];
                let today = new Date();
                if (dateStr === 'today' || dateStr === 'tonight' || dateStr === 'this evening' || dateStr === 'this afternoon' || dateStr === 'this morning') {
                    date = today.toISOString().split('T')[0];
                } else if (dateStr === 'yesterday') {
                    today.setDate(today.getDate() - 1);
                    date = today.toISOString().split('T')[0];
                } else if (dateStr === 'tomorrow') {
                    today.setDate(today.getDate() + 1);
                    date = today.toISOString().split('T')[0];
                }
            }
        }

        if (/\b(food|coffee|restaurant|cake|meal|dinner|lunch|beverage|tax)\b/i.test(transcript)) {
            category = "Food";
        } else if (/\b(grocery|supermarket|mart|vegetables|fruits|store|groceries|daily needs)\b/i.test(transcript)) {
            category = "Grocery";
        } else if (/\b(cinema|movie|ticket|theatre|multiplex)\b/i.test(transcript)) {
            category = "Movie Ticket";
        } else {
            category = "Other";
        }

        const descriptionMatch = transcript.match(/\bon\s([a-zA-Z\s]+?)(?:\s+(today|yesterday|tomorrow|tonight|this morning|this evening))?\b/i);
        if (descriptionMatch) {
            description = descriptionMatch[1].trim();
        } else {
            description = transcript.split(' ')[0];
        }

        setFormData({
            description: description || '',
            category: category || '',
            date: date || '',
            amount: amount || ''
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const resetSearch = () => {
        setSearchQuery('');
        setFilterCategory('');
        setFilterDate('');
    };

    const filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory ? expense.category === filterCategory : true;
        const matchesDate = filterDate ? expense.date === filterDate : true;
        return matchesSearch && matchesCategory && matchesDate;
    });

    return (
        <div className="layout">
            <main className="main-content">
            <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <div className={`expense-grid-container ${isExpanded ? "expense-grid-container-expanded" : ""}`}>
                <div className="header">
                    <h1 className="header-title">Expenses</h1>
                    <button onClick={() => openModal()} className="add-button">
                        Add Expense
                    </button>
                </div>
                <div className="search-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchQuery && (
                            <button onClick={resetSearch} className="reset-icon">
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="filter-options">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Grocery">Grocery</option>
                            <option value="Movie Ticket">Movie Ticket</option>
                            <option value="Other">Other</option>
                        </select>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Add/Edit Expense"
                    ariaHideApp={false}
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Add New Expense</h2>
                            <button onClick={closeModal} className="close-button">
                                <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="button-group">
                                <button
                                    type="button"
                                    onClick={() => setModalMode('scan')}
                                    className="action-button"
                                >
                                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.45 16.65a7 7 0 109.8 0L10 11a6 6 0 00-5.55 5.65z"></path>
                                    </svg>
                                    Scan Receipt
                                </button>
                                <button
                                    type="button"
                                    onClick={startListening}
                                    className="action-button"
                                >
                                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Voice Input
                                </button>
                            </div>
                            {modalMode === 'manual' && (
                                <form onSubmit={handleSubmit} className="expense-form">
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Amount</label>
                                            <div className="input-group">
                                                <span className="input-prefix">$</span>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={formData.amount}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="input-field"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field"
                                                placeholder="Coffee at Starbucks"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field"
                                            >
                                                <option value="">Select a category</option>
                                                <option value="Food">Food</option>
                                                <option value="Grocery">Grocery</option>
                                                <option value="Movie Ticket">Movie Ticket</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="save-button">
                                        Save Expense
                                    </button>
                                </form>
                            )}
                            {modalMode === 'scan' && (
                                <div className="scan-mode">
                                    <div className="scan-form">
                                        <form onSubmit={handleSubmit} className="p-4">
                                            <input
                                                type="text"
                                                name="description"
                                                placeholder="Description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field mb-2"
                                            />
                                            <input
                                                type="text"
                                                name="category"
                                                placeholder="Category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field mb-2"
                                            />
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field mb-2"
                                            />
                                            <input
                                                type="number"
                                                name="amount"
                                                placeholder="Amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                required
                                                className="input-field mb-2"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="input-field mb-2"
                                            />
                                            <div className="button-group mt-4">
                                                <button type="submit" className="save-button">
                                                    Save Expense
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="preview-box">
                                        <h3 className="preview-title">Preview:</h3>
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Receipt preview" className="preview-image" />
                                        ) : (
                                            <div className="no-preview">No Preview Available</div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {modalMode === 'voice' && (
                                <div className="voice-mode">
                                    <div className="interim-text">{interimText}</div>
                                    <form onSubmit={handleSubmit} className="p-4">
                                        <input
                                            type="text"
                                            name="description"
                                            placeholder="Description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field mb-2"
                                        />
                                        <input
                                            type="text"
                                            name="category"
                                            placeholder="Category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field mb-2"
                                        />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field mb-2"
                                        />
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="Amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            required
                                            className="input-field mb-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={isListening ? stopListening : startListening}
                                            className="voice-button mb-2"
                                        >
                                            {isListening ? "Stop Listening" : "Voice Input"}
                                        </button>
                                        {isListening && (
                                            <div className="interim-text">{interimText}</div>
                                        )}
                                        <button type="submit" className="save-button">
                                            Save Expense
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={viewModalOpen} onRequestClose={closeViewModal} contentLabel="View Expense Details" className="modal">
                    {viewData && (
                        <div className="view-modal-overlay">
                            <div className="view-modal-content">
                                <h2 className="view-modal-title">Expense Details</h2>
                                <p><strong>Description:</strong> {viewData.description}</p>
                                <p><strong>Category:</strong> {viewData.category}</p>
                                <p><strong>Date:</strong> {viewData.date}</p>
                                <p><strong>Amount: ₹</strong> {viewData.amount}</p>
                                <button onClick={closeViewModal} className="close-view-button">Close</button>
                            </div>
                        </div>
                    )}
                </Modal>
                <div className="expenses-table">
                    {filteredExpenses.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="table-header">Description</th>
                                    <th className="table-header">Category</th>
                                    <th className="table-header">Date</th>
                                    <th className="table-header">Amount</th>
                                    <th className="table-header">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses.map((expense, index) => (
                                    <tr key={index} className="table-row">
                                        <td className="table-cell">{expense.description}</td>
                                        <td className="table-cell">{expense.category}</td>
                                        <td className="table-cell">{expense.date}</td>
                                        <td className="table-cell">₹{expense.amount}</td>
                                        <td className="table-cell actions">
                                            <button onClick={() => handleView(index)} className="view-button">View</button>
                                            <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                                            <button onClick={() => handleDelete(index)} className="delete-button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-expenses">No expenses logged yet.</p>
                    )}
                </div>
                </div>
                <FloatingButton/>
            </main>
        </div>
    );
};

export default App;