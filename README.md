# 📝 To-Do List App

A simple and secure task manager that allows users to organize daily tasks efficiently. Features user authentication and PostgreSQL for data persistence.

## 🚀 Features

- ✅ Add, edit, and delete tasks
- 🔐 User authentication (login and registration)
- 📆 Organize tasks by user and day
- 🗄️ Persistent storage using PostgreSQL
- 📐 Server-side rendering with EJS

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS templating
- **Database:** PostgreSQL
- **Authentication:** bcrypt 
- **Version Control:** Git & GitHub

## 📂 Folder Structure
/To-do-list
│
├── views/ # EJS templates
├── public/ # CSS and static files
├── db/ # Database connection config
├── routes/ # App routes
├── models/ # Data models
├── app.js # Entry point
└── package.json # Dependencies and metadata


## ⚙️ Getting Started

### Prerequisites

- Node.js installed
- PostgreSQL installed and running
- `.env` file set up with database credentials

### Installation

```bash
git clone https://github.com/aristobells/To-do-list.git
cd To-do-list
npm install
Set up PostgreSQL
Create a database (e.g., todo_app)

Run SQL schema/migrations if available

Add .env file:
DB_HOST=localhost
DB_PORT=5432
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=todo_app
node app.js
Visit http://localhost:3000 in your browser.
🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first.

📧 Contact
Adelaja Oluwatobi
📩 adelajatobiemmanuel@gmail.com
🔗 GitHub Profile


