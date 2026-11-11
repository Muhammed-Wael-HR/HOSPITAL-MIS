const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Raw Data from User
const patients = [
  { MRN: "PAT-001", Full_Name: "Ahmed Mahmoud Ibrahim", National_ID: "29801011401234", Age: 28, Gender: "Male", Phone: "01012345678", Emergency_Contact: "01098765432", Address: "14 Abbas El-Akkad St, Nasr City, Cairo", Blood_Type: "A+", Allergies: "Penicillin Allergy", Registration_Date: "2026-10-15", Softr_Record_ID: "6YQSY7hKPPmvGxyATC62BL" },
  { MRN: "PAT-002", Full_Name: "Fatima Ali Hassan", National_ID: "29205121402345", Age: 34, Gender: "Female", Phone: "01123456789", Emergency_Contact: "01187654321", Address: "25 Al-Merghany St, Heliopolis, Cairo", Blood_Type: "O+", Allergies: "No Known Drug Allergies (NKDA)", Registration_Date: "2026-10-18", Softr_Record_ID: "RngeCKM5TSiTQpP7f3T9RW" },
  { MRN: "PAT-003", Full_Name: "Mahmoud Saeed Abdallah", National_ID: "28109201403456", Age: 45, Gender: "Male", Phone: "01234567890", Emergency_Contact: "01276543210", Address: "8 Corniche El-Nil St, Maadi, Cairo", Blood_Type: "B+", Allergies: "Sulfa Drugs Allergy", Registration_Date: "2026-10-19", Softr_Record_ID: "R4SnEABe4J3DGU8tL58t2B" },
  { MRN: "PAT-004", Full_Name: "Sara Ahmed Mostafa", National_ID: "30403151404567", Age: 22, Gender: "Female", Phone: "01511223344", Emergency_Contact: "01599887766", Address: "12 Talaat Harb St, Downtown, Cairo", Blood_Type: "O-", Allergies: "Bronchial Asthma", Registration_Date: "2026-10-19", Softr_Record_ID: "L9yBobgDkkzRQXPtt4spoF" },
  { MRN: "PAT-005", Full_Name: "Omar Khaled El-Sayed", National_ID: "27411081405678", Age: 52, Gender: "Male", Phone: "01099887766", Emergency_Contact: "01144332211", Address: "5 Gezirat El-Arab St, Zamalek, Cairo", Blood_Type: "AB+", Allergies: "Contrast Dye Allergy", Registration_Date: "2026-10-20", Softr_Record_ID: "GfE7PxqwoXD6dgZfhMv46r" },
  { MRN: "PAT-006", Full_Name: "Mona Hassan Youssef", National_ID: "29708251406789", Age: 19, Gender: "Female", Phone: "01155443322", Emergency_Contact: "01011223344", Address: "42 Sudan St, Mohandessin, Giza", Blood_Type: "A-", Allergies: "None", Registration_Date: "2026-10-21", Softr_Record_ID: "FzZhzne7G6FZDUvVFRdw67" },
  { MRN: "PAT-007", Full_Name: "Youssef Tamer Mansour", National_ID: "31412101407890", Age: 12, Gender: "Male", Phone: "01277665544", Emergency_Contact: "01066778899", Address: "19 Mosaddak St, Dokki, Giza", Blood_Type: "O+", Allergies: "Dust & Seasonal Allergy", Registration_Date: "2026-10-21", Softr_Record_ID: "2C9amsv4FkPuAgQbi1TU4n" },
  { MRN: "PAT-008", Full_Name: "Nourhan Adel Soliman", National_ID: "29504031408901", Age: 31, Gender: "Female", Phone: "01033221100", Emergency_Contact: "01233445566", Address: "7 Makram Ebeid St, Nasr City, Cairo", Blood_Type: "B-", Allergies: "Latex Allergy", Registration_Date: "2026-10-22", Softr_Record_ID: "XLRx1SFoP5xGmcBTQNPVrB" },
  { MRN: "PAT-009", Full_Name: "Hussein Tarek El-Din", National_ID: "26602141409012", Age: 60, Gender: "Male", Phone: "01144556677", Emergency_Contact: "01255443322", Address: "Villa 45, 90th Street, New Cairo", Blood_Type: "AB-", Allergies: "None", Registration_Date: "2026-10-23", Softr_Record_ID: "MqyXsHdiWtMfJAa9YHjfQ9" },
  { MRN: "PAT-010", Full_Name: "Mariam Amr Sherif", National_ID: "30007191400123", Age: 26, Gender: "Female", Phone: "01288990011", Emergency_Contact: "01077889900", Address: "10 Shubra St, Shubra, Cairo", Blood_Type: "A+", Allergies: "NSAIDs Allergy", Registration_Date: "2026-10-24", Softr_Record_ID: "TUdT481pw7z2Fov4E5o4jn" },
  { MRN: "PAT-011", Full_Name: "Hassan Mostafa Kamal", National_ID: "28806051401122", Age: 38, Gender: "Male", Phone: "01022334455", Emergency_Contact: "01199887700", Address: "33 Al-Haram St, Giza", Blood_Type: "O+", Allergies: "None", Registration_Date: "2026-10-25", Softr_Record_ID: "RZpBLT3NVGARTcLDR7UH7H" },
  { MRN: "PAT-012", Full_Name: "Dina Nabil El-Kashef", National_ID: "28510121402233", Age: 41, Gender: "Female", Phone: "01566778899", Emergency_Contact: "01533221144", Address: "16 Kasr El-Aini St, Manial, Cairo", Blood_Type: "B+", Allergies: "Penicillin Allergy", Registration_Date: "2026-10-26", Softr_Record_ID: "XvfPov9LUwGL5qVWVZeeE2" },
  { MRN: "PAT-013", Full_Name: "Khaled Reda Mansour", National_ID: "29103181403344", Age: 35, Gender: "Male", Phone: "01088773725", Emergency_Contact: "01299775533", Address: "22 El-Batal Ahmed Abdel Aziz, Mohandessin", Blood_Type: "A+", Allergies: "None", Registration_Date: "2026-10-28", Softr_Record_ID: "5dgufxAdXG6Lcy8P3d9w2b" },
  { MRN: "PAT-014", Full_Name: "Engy Sherif El-Ghabry", National_ID: "29909091404455", Age: 27, Gender: "Female", Phone: "01177662957", Emergency_Contact: "01011335577", Address: "5 El-Ahram St, Korba, Heliopolis", Blood_Type: "O-", Allergies: "No Known Drug Allergies (NKDA)", Registration_Date: "2026-10-28", Softr_Record_ID: "U85kpHmeaHWdDCFudaocVJ" },
  { MRN: "PAT-015", Full_Name: "Mostafa Kareem Hamad", National_ID: "27601201405566", Age: 50, Gender: "Male", Phone: "01267241433", Emergency_Contact: "01122446688", Address: "18 El-Tahrir St, Dokki, Giza", Blood_Type: "AB+", Allergies: "Aspirin Allergy", Registration_Date: "2026-10-30", Softr_Record_ID: "VBpFK4MzgbEM4FfgxenH2b" }
];

const visits = [
  { Visit_ID: "VIS-101", MRN: "PAT-001", Patient_Name: "Ahmed Mahmoud Ibrahim", Doctor_Name: "Dr. Mohamed El-Alfy", Department: "Internal Medicine", Diagnosis: "Acute Tonsillitis & Pharyngitis", Follow_Up_Date: "2026-10-15", Visit_Status: "Completed", Softr_Record_ID: "7cKkPKQ7bRMfuVgwwTjrUa" },
  { Visit_ID: "VIS-102", MRN: "PAT-002", Patient_Name: "Fatima Ali Hassan", Doctor_Name: "Dr. Rania Abdelaziz", Department: "Pediatrics", Diagnosis: "Acute Gastroenteritis", Follow_Up_Date: "2026-10-18", Visit_Status: "Completed", Softr_Record_ID: "2VmQrBRi15tRG5aoQ3EVir" },
  { Visit_ID: "VIS-103", MRN: "PAT-003", Patient_Name: "Mahmoud Saeed Abdallah", Doctor_Name: "Dr. Kareem El-Sherif", Department: "Orthopedics", Diagnosis: "Knee Osteoarthritis & Muscle Strain", Follow_Up_Date: "2026-10-19", Visit_Status: "Completed", Softr_Record_ID: "JBwYZsS4tD1KhgJtdEWSh" },
  { Visit_ID: "VIS-104", MRN: "PAT-004", Patient_Name: "Sara Ahmed Mostafa", Doctor_Name: "Dr. Mohamed El-Alfy", Department: "Internal Medicine", Diagnosis: "Migraine & General Fatigue", Follow_Up_Date: "2026-10-19", Visit_Status: "Completed", Softr_Record_ID: "CQzpYC1PDjaEK4baB51LW3" },
  { Visit_ID: "VIS-105", MRN: "PAT-005", Patient_Name: "Omar Khaled El-Sayed", Doctor_Name: "Dr. Hisham Yehia", Department: "Cardiology", Diagnosis: "Hypertension & Chest Discomfort", Follow_Up_Date: "2026-10-20", Visit_Status: "Completed", Softr_Record_ID: "131zB7d5ZBuno2uvM97s8g" },
  { Visit_ID: "VIS-106", MRN: "PAT-006", Patient_Name: "Mona Hassan Youssef", Doctor_Name: "Dr. Salma Fouad", Department: "Dermatology", Diagnosis: "Allergic Contact Dermatitis", Follow_Up_Date: "2026-10-21", Visit_Status: "Completed", Softr_Record_ID: "CyfUd4VXvXrRxUV597y3Me" },
  { Visit_ID: "VIS-107", MRN: "PAT-007", Patient_Name: "Youssef Tamer Mansour", Doctor_Name: "Dr. Rania Abdelaziz", Department: "Pediatrics", Diagnosis: "Seasonal Influenza & Fever", Follow_Up_Date: "2026-10-21", Visit_Status: "Completed", Softr_Record_ID: "Qvvqp3zeNzJgVgaehrbYAd" },
  { Visit_ID: "VIS-108", MRN: "PAT-008", Patient_Name: "Nourhan Adel Soliman", Doctor_Name: "Dr. Ahmed Samy", Department: "General Surgery", Diagnosis: "Suspected Acute Appendicitis Evaluation", Follow_Up_Date: "2026-10-22", Visit_Status: "Completed", Softr_Record_ID: "FvDn2j3kzL5tumXaPKkY3A" },
  { Visit_ID: "VIS-109", MRN: "PAT-009", Patient_Name: "Hussein Tarek El-Din", Doctor_Name: "Dr. Hisham Yehia", Department: "Cardiology", Diagnosis: "Routine Cardiology Follow-up & ECG", Follow_Up_Date: "2026-10-23", Visit_Status: "Completed", Softr_Record_ID: "CVUwBpqdRaL2Kf8R2RJ6Df" },
  { Visit_ID: "VIS-110", MRN: "PAT-010", Patient_Name: "Mariam Amr Sherif", Doctor_Name: "Dr. Noha El-Sayed", Department: "Gynecology", Diagnosis: "Antenatal Care Visit (1st Trimester)", Follow_Up_Date: "2026-10-24", Visit_Status: "Completed", Softr_Record_ID: "62r7qs4U3ipJPQDRUYRfHi" },
  { Visit_ID: "VIS-111", MRN: "PAT-011", Patient_Name: "Hassan Mostafa Kamal", Doctor_Name: "Dr. Tarek Hamdy", Department: "ENT", Diagnosis: "Chronic Sinusitis Consultation", Follow_Up_Date: "2026-10-25", Visit_Status: "Completed", Softr_Record_ID: "65Q1LLM9x6oiYHHRNGbRa5" },
  { Visit_ID: "VIS-112", MRN: "PAT-012", Patient_Name: "Dina Nabil El-Kashef", Doctor_Name: "Dr. Sherif Reda", Department: "Neurology", Diagnosis: "Cervical Spondylosis Follow-up", Follow_Up_Date: "2026-10-26", Visit_Status: "Completed", Softr_Record_ID: "38LMmWpkzwr5MyKYTPJi1b" },
  { Visit_ID: "VIS-113", MRN: "PAT-013", Patient_Name: "Khaled Reda Mansour", Doctor_Name: "Dr. Kareem El-Sherif", Department: "Orthopedics", Diagnosis: "Knee Pain Assessment & MRI Review", Follow_Up_Date: "2026-10-28", Visit_Status: "Completed", Softr_Record_ID: "7XZuongKWtwc2mV2XrKB8C" },
  { Visit_ID: "VIS-114", MRN: "PAT-014", Patient_Name: "Engy Sherif El-Ghabry", Doctor_Name: "Dr. Noha El-Sayed", Department: "Gynecology", Diagnosis: "Routine Gynecological Check-up", Follow_Up_Date: "2026-10-28", Visit_Status: "Completed", Softr_Record_ID: "AXjvWPSvjjnU8DauCjZkLZ" },
  { Visit_ID: "VIS-115", MRN: "PAT-015", Patient_Name: "Mostafa Kareem Hamad", Doctor_Name: "Dr. Hisham Yehia", Department: "Cardiology", Diagnosis: "Hypertension Management & Echo", Follow_Up_Date: "2026-10-30", Visit_Status: "Completed", Softr_Record_ID: "FCvqyjCeR1QGS1hquANKJ7" }
];

const orders = [
  { Order_ID: "ORD-501", MRN: "PAT-001", Patient_Name: "Ahmed Mahmoud Ibrahim", Department: "Pharmacy", Details: "Augmentin 1g Tablets", Status: "Completed", Softr_Record_ID: "PE6qBYzYaAAoHWwB7DCPv4" },
  { Order_ID: "ORD-502", MRN: "PAT-001", Patient_Name: "Ahmed Mahmoud Ibrahim", Department: "Lab", Details: "Complete Blood Count (CBC)", Status: "Completed", Softr_Record_ID: "Wrg3Xz8s2Qnj6XgMebKTx1" },
  { Order_ID: "ORD-503", MRN: "PAT-002", Patient_Name: "Fatima Ali Hassan", Department: "Lab", Details: "Stool Analysis & Culture", Status: "Completed", Softr_Record_ID: "JgcUCD7YcaZMrvrYM719pP" },
  { Order_ID: "ORD-504", MRN: "PAT-002", Patient_Name: "Fatima Ali Hassan", Department: "Pharmacy", Details: "Antinal Syrup + ORS Packets", Status: "Completed", Softr_Record_ID: "NVaRKjqjFLJXhDYH44wAYV" },
  { Order_ID: "ORD-505", MRN: "PAT-003", Patient_Name: "Mahmoud Saeed Abdallah", Department: "Radiology", Details: "Knee Joint X-Ray (AP/Lateral)", Status: "Completed", Softr_Record_ID: "J6fvt9fCyo6KQfWahzJWAc" },
  { Order_ID: "ORD-506", MRN: "PAT-004", Patient_Name: "Sara Ahmed Mostafa", Department: "Pharmacy", Details: "Panadol Extra & Migraine Care", Status: "Completed", Softr_Record_ID: "JwdVgYeo37XNQ3VGP1mqcK" },
  { Order_ID: "ORD-507", MRN: "PAT-005", Patient_Name: "Omar Khaled El-Sayed", Department: "Lab", Details: "Lipid Profile & Fasting Blood Sugar", Status: "Completed", Softr_Record_ID: "Taw8urRX3jfCZ8swxqmDwi" },
  { Order_ID: "ORD-508", MRN: "PAT-005", Patient_Name: "Omar Khaled El-Sayed", Department: "Radiology", Details: "Electrocardiogram (ECG)", Status: "Completed", Softr_Record_ID: "9UEU64nB1jXFmE6ztNFZxe" },
  { Order_ID: "ORD-509", MRN: "PAT-006", Patient_Name: "Mona Hassan Youssef", Department: "Pharmacy", Details: "Betnovate Ointment + Histazine", Status: "Completed", Softr_Record_ID: "PqyCqy4sfhsqbMmtQV5sRb" },
  { Order_ID: "ORD-510", MRN: "PAT-007", Patient_Name: "Youssef Tamer Mansour", Department: "Pharmacy", Details: "Cetal Pediatric Syrup + Vitamin C", Status: "Completed", Softr_Record_ID: "D5F2YA1TkMVUeWfJro8KEx" },
  { Order_ID: "ORD-511", MRN: "PAT-008", Patient_Name: "Nourhan Adel Soliman", Department: "Radiology", Details: "Abdominal & Pelvic Ultrasound", Status: "Completed", Softr_Record_ID: "Td4TYEbcDLdPNYNVFxpuUt" },
  { Order_ID: "ORD-512", MRN: "PAT-008", Patient_Name: "Nourhan Adel Soliman", Department: "Lab", Details: "Complete Blood Count (CBC) & CRP", Status: "Completed", Softr_Record_ID: "H6uxvY4RezKjemqra3uEEx" },
  { Order_ID: "ORD-513", MRN: "PAT-009", Patient_Name: "Hussein Tarek El-Din", Department: "Lab", Details: "HbA1c Test & Kidney Function", Status: "Pending", Softr_Record_ID: "WR244RHPVqFjP5cmYEYrDS" },
  { Order_ID: "ORD-514", MRN: "PAT-010", Patient_Name: "Mariam Amr Sherif", Department: "Radiology", Details: "Obstetric Ultrasound (Fetal Scan)", Status: "Pending", Softr_Record_ID: "73qU2cqVhzUtQ6M7hhjxUH" },
  { Order_ID: "ORD-515", MRN: "PAT-010", Patient_Name: "Mariam Amr Sherif", Department: "Pharmacy", Details: "Folic Acid 5mg & Calcium Supplements", Status: "Pending", Softr_Record_ID: "MpHXVfik8WZEVCjSa8Pb1D" },
  { Order_ID: "ORD-516", MRN: "PAT-011", Patient_Name: "Hassan Mostafa Kamal", Department: "Pharmacy", Details: "Augmentin 1g + Nasal Spray", Status: "Pending", Softr_Record_ID: "MB3JkVzFstAiV1hcJdzALq" },
  { Order_ID: "ORD-517", MRN: "PAT-012", Patient_Name: "Dina Nabil El-Kashef", Department: "Radiology", Details: "Cervical Spine MRI Scan", Status: "Pending", Softr_Record_ID: "GiS1YpiUaWbvPQy1WzUDzT" },
  { Order_ID: "ORD-518", MRN: "PAT-013", Patient_Name: "Khaled Reda Mansour", Department: "Radiology", Details: "Knee Joint MRI Scan", Status: "Pending", Softr_Record_ID: "XKGGuhi2XqAV4hRiceB1Qj" },
  { Order_ID: "ORD-519", MRN: "PAT-014", Patient_Name: "Engy Sherif El-Ghabry", Department: "Lab", Details: "Complete Blood Count (CBC)", Status: "Pending", Softr_Record_ID: "6tmoD3bs76VwXKY9y6Xcx7" },
  { Order_ID: "ORD-520", MRN: "PAT-015", Patient_Name: "Mostafa Kareem Hamad", Department: "Radiology", Details: "Echocardiogram (ECHO)", Status: "Pending", Softr_Record_ID: "4vQgS5tJV5EcdQQwMj45rQ" }
];

const invoices = [
  { Invoice_ID: "INV-901", MRN: "PAT-001", Patient_Name: "Ahmed Mahmoud Ibrahim", Amount: 350, Payment_Status: "Paid", Payment_Method: "Cash", Softr_Record_ID: "8emyM6teJgKYwrBP9Ji95E" },
  { Invoice_ID: "INV-902", MRN: "PAT-002", Patient_Name: "Fatima Ali Hassan", Amount: 200, Payment_Status: "Paid", Payment_Method: "Insurance", Softr_Record_ID: "H4kVZLuN5XGoqkVtwz4czf" },
  { Invoice_ID: "INV-903", MRN: "PAT-003", Patient_Name: "Mahmoud Saeed Abdallah", Amount: 450, Payment_Status: "Paid", Payment_Method: "Card", Softr_Record_ID: "7UuAN3hgiaAdPPbTnnFAg8" },
  { Invoice_ID: "INV-904", MRN: "PAT-004", Patient_Name: "Sara Ahmed Mostafa", Amount: 150, Payment_Status: "Paid", Payment_Method: "Cash", Softr_Record_ID: "8Tz2urW8frkA6kqHuXtjyS" },
  { Invoice_ID: "INV-905", MRN: "PAT-005", Patient_Name: "Omar Khaled El-Sayed", Amount: 750, Payment_Status: "Paid", Payment_Method: "Insurance", Softr_Record_ID: "GexxF1YwZYfetLUG2W8Xvr" },
  { Invoice_ID: "INV-906", MRN: "PAT-006", Patient_Name: "Mona Hassan Youssef", Amount: 180, Payment_Status: "Paid", Payment_Method: "Cash", Softr_Record_ID: "NKzqs61UnhQBeewCuusFdS" },
  { Invoice_ID: "INV-907", MRN: "PAT-007", Patient_Name: "Youssef Tamer Mansour", Amount: 120, Payment_Status: "Paid", Payment_Method: "Cash", Softr_Record_ID: "TpHoUr1z1VSEyvhGGZpfGU" },
  { Invoice_ID: "INV-908", MRN: "PAT-008", Patient_Name: "Nourhan Adel Soliman", Amount: 550, Payment_Status: "Paid", Payment_Method: "Card", Softr_Record_ID: "M8X9tMozLM1YGCNyJp1XP" },
  { Invoice_ID: "INV-909", MRN: "PAT-009", Patient_Name: "Hussein Tarek El-Din", Amount: 400, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "Mi8n8bW9mz8fMJBQk4wrxy" },
  { Invoice_ID: "INV-910", MRN: "PAT-010", Patient_Name: "Mariam Amr Sherif", Amount: 650, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "PLCHGhv2Krx3XZmnhx6YGc" },
  { Invoice_ID: "INV-911", MRN: "PAT-011", Patient_Name: "Hassan Mostafa Kamal", Amount: 280, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "JLpRf5eie6onkK5vTw3xwv" },
  { Invoice_ID: "INV-912", MRN: "PAT-012", Patient_Name: "Dina Nabil El-Kashef", Amount: 850, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "Gq3uBs1dJAp1ME3fzoduGV" },
  { Invoice_ID: "INV-913", MRN: "PAT-013", Patient_Name: "Khaled Reda Mansour", Amount: 500, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "FvKDEKwRSArBT9Kna6sbUR" },
  { Invoice_ID: "INV-914", MRN: "PAT-014", Patient_Name: "Engy Sherif El-Ghabry", Amount: 300, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "Tdc3NoTgAxAhifU7L7QnAa" },
  { Invoice_ID: "INV-915", MRN: "PAT-015", Patient_Name: "Mostafa Kareem Hamad", Amount: 700, Payment_Status: "Unpaid", Payment_Method: "Pending", Softr_Record_ID: "JBBkSE8WzuMcd4TLukEkXJ" }
];

const users = [
  { Name: "Dr. Mohamed El-Alfy", Role: "Doctor", Email: "mohamed.elalfy@hospital.com", Password_Initial: "mohamed2009", Softr_Record_ID: "M7cWuD93Z59BW6iavTBmxD" },
  { Name: "Dr. Rania Abdelaziz", Role: "Doctor", Email: "rania.abdelaziz@hospital.com", Password_Initial: "doctor123", Softr_Record_ID: "MJPhSxsYHxbHe3rR3Ka4KA" },
  { Name: "Dr. Ahmed Khaled", Role: "Doctor", Email: "ahmed.khaled@hospital.com", Password_Initial: "doctor123", Softr_Record_ID: "UpZo43FzJPjkf43BjQYQze" },
  { Name: "Dr. Sara El-Sayed", Role: "Doctor", Email: "sara.elsayed@hospital.com", Password_Initial: "doctor123", Softr_Record_ID: "7s2hYC9BTiiAK7bvqiKamo" },
  { Name: "Dr. Omar Hassan", Role: "Doctor", Email: "omar.hassan@hospital.com", Password_Initial: "doctor123", Softr_Record_ID: "A6TGfuoLCmdCFFGUAzL3aK" },
  { Name: "Maha Ahmed Hassan", Role: "Receptionist", Email: "maha.ahmed@hospital.com", Password_Initial: "recep123", Softr_Record_ID: "AjBtRsGGqC5p7TNdjPVVuY" },
  { Name: "Ahmed Mahmoud Ali", Role: "Receptionist", Email: "ahmed.ali@hospital.com", Password_Initial: "recep123", Softr_Record_ID: "Hx9UDKoWV7XM79vt9ZTyRd" },
  { Name: "Nourhan Tarek", Role: "Receptionist", Email: "nourhan.tarek@hospital.com", Password_Initial: "recep123", Softr_Record_ID: "JXMT9ywdoZ8FeDgpiEPtZL" },
  { Name: "Youssef Adel", Role: "Receptionist", Email: "youssef.adel@hospital.com", Password_Initial: "recep123", Softr_Record_ID: "ALwWgKo4ugYzt4AMBSfv8p" },
  { Name: "Mariam Mostafa", Role: "Admin", Email: "mariam.mostafa@hospital.com", Password_Initial: "admin123", Softr_Record_ID: "Ke5Fetvc4SEJESXQ9HcWRC" },
  { Name: "Khaled Ibrahim", Role: "Admin", Email: "khaled.ibrahim@hospital.com", Password_Initial: "admin123", Softr_Record_ID: "35fn8xQ9ojhGUJ4qFw6Bkw" },
  { Name: "Hala Mostafa", Role: "Staff", Email: "hala.mostafa@example.com", Password_Initial: "staff123", Softr_Record_ID: "MrUE5u2kYe1ypDjhEYEMKA" },
  { Name: "Karim Adel", Role: "Staff", Email: "karim.adel@example.com", Password_Initial: "staff123", Softr_Record_ID: "75GzgMv9Py7o16BWopc7kw" },
  { Name: "Maryam Yasser", Role: "Staff", Email: "m01275309031@gmail.com", Password_Initial: "staff123", Softr_Record_ID: "2E5AweuSerfd8cbNAbmJ59" }
];

const appointments = [
  { Appointment_ID: "APT-001", MRN: "PAT-101", Patient_Name: "Ziad Tarek El-Shennawy", National_ID: "29503120101234", Phone: "01011223344", Doctor_Name: "Dr. Mohamed El-Alfy", Department: "Internal Medicine", Appointment_Date: "2026-11-01", Time_Slot: "10:00:00", Status: "Confirmed", Softr_Record_ID: "NvCExWmGzxGKKdVkZkq6v6" },
  { Appointment_ID: "APT-002", MRN: "PAT-102", Patient_Name: "Reem Ibrahim El-Desouky", National_ID: "30105250105678", Phone: "01122334455", Doctor_Name: "Dr. Noha El-Sayed", Department: "Gynecology", Appointment_Date: "2026-11-01", Time_Slot: "11:30:00", Status: "Confirmed", Softr_Record_ID: "5EYHqRkYZRhBBQm9ysWqrs" },
  { Appointment_ID: "APT-003", MRN: "PAT-103", Patient_Name: "Mostafa Hossam El-Din", National_ID: "28409140109012", Phone: "01233445566", Doctor_Name: "Dr. Kareem El-Sherif", Department: "Orthopedics", Appointment_Date: "2026-11-02", Time_Slot: "13:00:00", Status: "Confirmed", Softr_Record_ID: "VSYApZ9j6ZaTSxGRMwNhyU" },
  { Appointment_ID: "APT-004", MRN: "PAT-104", Patient_Name: "Nada Mohamed Abdelhamid", National_ID: "29812030103456", Phone: "01544556677", Doctor_Name: "Dr. Hisham Yehia", Department: "Cardiology", Appointment_Date: "2026-11-02", Time_Slot: "15:00:00", Status: "Pending", Softr_Record_ID: "5UZcryFAi9CQ4w2zLa2LER" },
  { Appointment_ID: "APT-005", MRN: "PAT-105", Patient_Name: "Ahmed Samir El-Prince", National_ID: "27602190107890", Phone: "01055667788", Doctor_Name: "Dr. Rania Abdelaziz", Department: "Pediatrics", Appointment_Date: "2026-11-03", Time_Slot: "09:30:00", Status: "Pending", Softr_Record_ID: "CM74DU3bj45Th8fUbhMpqo" },
  { Appointment_ID: "APT-006", MRN: "PAT-106", Patient_Name: "Yasmine Fouad Mehran", National_ID: "30207220102345", Phone: "01166778899", Doctor_Name: "Dr. Shaimaa Abdallah", Department: "Gynecology", Appointment_Date: "2026-11-04", Time_Slot: "12:00:00", Status: "Pending", Softr_Record_ID: "4WRbrEJC5DCe6hqxme5AY4" },
  { Appointment_ID: "APT-007", MRN: "PAT-107", Patient_Name: "Kareem Essam El-Din", National_ID: "28911040106789", Phone: "01277889900", Doctor_Name: "Dr. Ahmed El-Baz", Department: "Internal Medicine", Appointment_Date: "2026-11-05", Time_Slot: "14:00:00", Status: "Pending", Softr_Record_ID: "UZEcZXntQRLyxesi3LuYA2" },
  { Appointment_ID: "APT-008", MRN: "PAT-108", Patient_Name: "Sara Gamal El-Alfy", National_ID: "29406180104321", Phone: "01088990011", Doctor_Name: "Dr. Hany El-Rouby", Department: "Cardiology", Appointment_Date: "2026-11-07", Time_Slot: "10:30:00", Status: "Confirmed", Softr_Record_ID: "KRwcLv4mnLbcf7zJTSWwda" },
  { Appointment_ID: "APT-009", MRN: "PAT-109", Patient_Name: "Islam Khaled El-Menshawy", National_ID: "28110250108901", Phone: "01199001122", Doctor_Name: "Dr. Kareem Abdelkhalek", Department: "Orthopedics", Appointment_Date: "2026-11-08", Time_Slot: "13:30:00", Status: "Pending", Softr_Record_ID: "5xYrR2J3rg7V9AF138rWkv" },
  { Appointment_ID: "APT-010", MRN: "PAT-110", Patient_Name: "Doaa Ragab Ezz El-Din", National_ID: "30304110105432", Phone: "01211223344", Doctor_Name: "Dr. Mahmoud El-Sherif", Department: "Pediatrics", Appointment_Date: "2026-11-10", Time_Slot: "11:00:00", Status: "Confirmed", Softr_Record_ID: "KFG1NA2cimeaWo3PAkXTB6" },
  { Appointment_ID: "APT-011", MRN: "PAT-111", Patient_Name: "Tarek Abdelrahman Hassan", National_ID: "27208300101122", Phone: "01522334455", Doctor_Name: "Dr. Osama El-Naggar", Department: "Dermatology", Appointment_Date: "2026-11-12", Time_Slot: "16:00:00", Status: "Pending", Softr_Record_ID: "8TAeVqTzSZa5h4oUHGkE44" },
  { Appointment_ID: "APT-012", MRN: "PAT-112", Patient_Name: "Marwa Nasser El-Sawy", National_ID: "29603150107654", Phone: "01033445566", Doctor_Name: "Dr. Hany El-Rouby", Department: "Cardiology", Appointment_Date: "2026-11-14", Time_Slot: "10:00:00", Status: "Confirmed", Softr_Record_ID: "XfgNd5tS4j6q2gjkxgTyQv" },
  { Appointment_ID: "APT-013", MRN: "PAT-113", Patient_Name: "Sherif Mostafa Qandeel", National_ID: "28312010103344", Phone: "01144556677", Doctor_Name: "Dr. Osama El-Naggar", Department: "Dermatology", Appointment_Date: "2026-11-15", Time_Slot: "14:30:00", Status: "Pending", Softr_Record_ID: "7TawewztMVvC3WmBKf71pG" },
  { Appointment_ID: "APT-014", MRN: "PAT-114", Patient_Name: "Aya Kamal El-Din Zahran", National_ID: "30501140109876", Phone: "01255667788", Doctor_Name: "Dr. Mahmoud El-Sherif", Department: "Pediatrics", Appointment_Date: "2026-11-17", Time_Slot: "12:00:00", Status: "Confirmed", Softr_Record_ID: "DPpCP39WymySycrztQfC8N" },
  { Appointment_ID: "APT-015", MRN: "PAT-115", Patient_Name: "Sameh Abdelaziz Osman", National_ID: "27907200102233", Phone: "01066778899", Doctor_Name: "Dr. Mohamed Farid", Department: "General Surgery", Appointment_Date: "2026-11-18", Time_Slot: "09:00:00", Status: "Pending", Softr_Record_ID: "RW8H9g2koDH12Eu4aeV49t" },
  { Appointment_ID: "APT-016", MRN: "PAT-116", Patient_Name: "Heba Tawfik El-Hawary", National_ID: "29304160106543", Phone: "01177889900", Doctor_Name: "Dr. Ahmed El-Baz", Department: "Internal Medicine", Appointment_Date: "2026-11-20", Time_Slot: "11:30:00", Status: "Confirmed", Softr_Record_ID: "JvcQHbcajbFpEiymEJBtKG" },
  { Appointment_ID: "APT-017", MRN: "PAT-117", Patient_Name: "Ramy Hamed El-Masry", National_ID: "28609280104455", Phone: "01288990011", Doctor_Name: "Dr. Shaimaa Abdallah", Department: "Gynecology", Appointment_Date: "2026-11-22", Time_Slot: "13:00:00", Status: "Pending", Softr_Record_ID: "EbUgnKVwJXMBmHxo9VJuGB" },
  { Appointment_ID: "APT-018", MRN: "PAT-118", Patient_Name: "Asmaa Wahby Kotb", National_ID: "30002100108765", Phone: "01599001122", Doctor_Name: "Dr. Tarek Hamdy", Department: "ENT", Appointment_Date: "2026-11-24", Time_Slot: "15:30:00", Status: "Confirmed", Softr_Record_ID: "8hAXcDNiQqQV4BQG1bK72m" },
  { Appointment_ID: "APT-019", MRN: "PAT-119", Patient_Name: "Waleed Sabry El-Banhawy", National_ID: "27505190101357", Phone: "01011335577", Doctor_Name: "Dr. Tarek Abdelsalam", Department: "Neurology", Appointment_Date: "2026-11-25", Time_Slot: "10:00:00", Status: "Pending", Softr_Record_ID: "PncvURnxQ4CmBpG41nvcZX" },
  { Appointment_ID: "APT-020", MRN: "PAT-120", Patient_Name: "Nourahan Saeed Badr", National_ID: "29711030102468", Phone: "01122446688", Doctor_Name: "Dr. Kareem Abdelkhalek", Department: "Orthopedics", Appointment_Date: "2026-11-27", Time_Slot: "12:30:00", Status: "Confirmed", Softr_Record_ID: "HtEUTbcyLwEa3oWq5guBNz" },
  { Appointment_ID: "APT-021", MRN: "PAT-121", Patient_Name: "Hossam El-Din Mokhtar", National_ID: "28206240103579", Phone: "01233557799", Doctor_Name: "Dr. Shaimaa Abdallah", Department: "Gynecology", Appointment_Date: "2026-11-29", Time_Slot: "14:00:00", Status: "Pending", Softr_Record_ID: "B5zThGuBknsKymEUriHui2" },
  { Appointment_ID: "APT-022", MRN: "PAT-122", Patient_Name: "Basma Adel El-Fakharany", National_ID: "29908120104680", Phone: "01544668800", Doctor_Name: "Dr. Hany El-Rouby", Department: "Cardiology", Appointment_Date: "2026-11-30", Time_Slot: "16:30:00", Status: "Pending", Softr_Record_ID: "WwwPv9t846gGnFg3qGknbS" }
];

// Create workbook
const wb = XLSX.utils.book_new();

// Add sheets
const wsPatients = XLSX.utils.json_to_sheet(patients);
const wsVisits = XLSX.utils.json_to_sheet(visits);
const wsOrders = XLSX.utils.json_to_sheet(orders);
const wsInvoices = XLSX.utils.json_to_sheet(invoices);
const wsUsers = XLSX.utils.json_to_sheet(users);
const wsAppointments = XLSX.utils.json_to_sheet(appointments);

// Auto-adjust column widths
[
  { ws: wsPatients, data: patients },
  { ws: wsVisits, data: visits },
  { ws: wsOrders, data: orders },
  { ws: wsInvoices, data: invoices },
  { ws: wsUsers, data: users },
  { ws: wsAppointments, data: appointments }
].forEach(({ ws, data }) => {
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    ws['!cols'] = keys.map(k => {
      let maxLen = k.length;
      data.forEach(row => {
        const val = row[k] !== undefined && row[k] !== null ? String(row[k]) : '';
        if (val.length > maxLen) maxLen = val.length;
      });
      return { wch: Math.min(maxLen + 4, 45) };
    });
  }
});

XLSX.utils.book_append_sheet(wb, wsPatients, "Patients (المرضى)");
XLSX.utils.book_append_sheet(wb, wsVisits, "Visits (الزيارات والكشوفات)");
XLSX.utils.book_append_sheet(wb, wsOrders, "Clinical Orders (الطلبات)");
XLSX.utils.book_append_sheet(wb, wsInvoices, "Invoices (الفواتير)");
XLSX.utils.book_append_sheet(wb, wsUsers, "Staff & Users (المستخدمين)");
XLSX.utils.book_append_sheet(wb, wsAppointments, "Appointments (المواعيد)");

// Paths to save
const desktopPath = "C:\\Users\\Emak\\Desktop\\MEDEVAC_TEAM_Database.xlsx";
const publicPath = path.join(__dirname, "..", "public", "MEDEVAC_TEAM_Database.xlsx");

// Ensure public dir exists
const publicDir = path.dirname(publicPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write file
XLSX.writeFile(wb, desktopPath);
console.log(`Saved Excel database to Desktop: ${desktopPath}`);

XLSX.writeFile(wb, publicPath);
console.log(`Saved Excel database to Public folder: ${publicPath}`);
