import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Tesseract from 'tesseract.js';
import expenseService from '../services/expenseService';
import { format } from 'date-fns';