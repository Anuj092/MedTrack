# 💊 MedTrack

MedTrack is a modern medication management app built using **React**, **TypeScript**, and **Supabase**. It helps users track their medications, get timely reminders, and maintain their health routines effortlessly.

## 📱 Features

- ✅ Add and manage medications
- 🕒 Set daily or custom reminders
- 📅 Integration with calendar (Google Calendar support)
- 🔔 Notification system for reminders
- 📈 Dashboard with heatmap and activity tracking
- 🔐 Authentication via Supabase

## ⚙️ Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons/UI**: Lucide-react, Shadcn/UI
- **Build Tool**: Vite
- **Calendar API**: Google Calendar (OAuth)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Anuj092/MedTrack.git
cd MedTrack

2. Install dependencies
bash
Copy
Edit
npm install
3. Setup environment variables
Create a .env file in the root directory and add the following:

bash
Copy
Edit
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
4. Run the development server
bash
Copy
Edit
npm run dev
Your app will be live at http://localhost:5173

📂 Project Structure
bash
Copy
Edit
src/
├── components/       # Reusable UI components
├── contexts/         # Auth and global contexts
├── hooks/            # Custom hooks
├── lib/              # Supabase config and utility functions
├── pages/            # Main routes/screens
├── types/            # TypeScript types
🛠️ Future Enhancements
Push notifications

Medicine stock tracker

Health reports integration

PWA support

🙌 Contribution
Pull requests and suggestions are welcome! If you’d like to contribute:

Fork the repo

Create your feature branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Add feature')

Push to the branch (git push origin feature-name)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

Made with ❤️ by Anuj Mishra
