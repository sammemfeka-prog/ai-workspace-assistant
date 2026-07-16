# AI PA (Productivity Assistant)

AI PA (Productivity Assistant) is a modern, responsive SaaS-style web application that helps professionals automate everyday workplace tasks using Artificial Intelligence. The application combines AI-powered meeting summarization, intelligent task planning, and an interactive workplace assistant to improve productivity and save valuable time.

Inspired by productivity platforms such as Microsoft Copilot, Notion AI, Slack, and Linear, AI PA delivers a clean, intuitive, and accessible user experience without requiring user registration or sign-in.

> **Portfolio Project:** This application was developed for educational, portfolio, and assessment purposes to demonstrate proficiency in modern frontend development, responsive UI design, and AI-powered application architecture. AI functionality is designed for demonstration and is ready for integration with AI services such as the OpenAI API.

---

# 📖 Project Overview

AI PA (Productivity Assistant) streamlines workplace productivity by providing three AI-powered tools within a single application:

- **Meeting Notes Summarizer** – Convert meeting notes into structured summaries with executive summaries, key decisions, action items, assessments, and deadlines.
- **AI Task Planner** – Generate optimized daily or weekly schedules based on task priorities, deadlines, estimated durations, and available working hours.
- **AI Workplace Assistant** – An AI chat assistant that helps users write professional emails, draft reports, prepare meetings, brainstorm ideas, summarize information, and answer workplace-related questions.

The application also includes a productivity dashboard that estimates time saved, tracks AI tool usage, and provides insights into weekly productivity.

---

# ✨ Features Implemented

## 🏠 Dashboard

- Welcome dashboard
- Quick access cards for AI tools
- Weekly productivity analytics
- Estimated time saved
- Meetings summarized counter
- Schedules generated counter
- AI conversations counter
- Most-used AI tool
- Recent activity tracking

## 📝 Meeting Notes Summarizer

- Large meeting notes editor
- AI-generated structured summaries
- Executive Summary
- Key Decisions
- Action Items
- Assessments (Risks, Observations, Recommendations)
- Deadlines and important dates
- Editable AI output
- Copy summary
- Download summary as TXT
- Regenerate summary
- Clear results

## 📅 AI Task Planner

- Task input
- Priority selection
- Due date management
- Estimated duration
- Available working hours
- AI-generated optimized schedule
- Intelligent prioritization
- Deadline-aware planning
- Focus session recommendations
- Scheduled breaks
- Conflict avoidance
- Editable schedule
- Copy schedule
- Download schedule
- Regenerate schedule
- Clear planner

## 💬 AI Workplace Assistant

Supports workplace productivity tasks including:

- Professional email writing
- Report drafting
- Meeting preparation
- Brainstorming ideas
- Workplace concept explanations
- Agenda creation
- Information summarization
- Productivity advice
- General workplace questions

Chat features include:

- Markdown support
- Typing indicator
- Suggested prompts
- Auto-scroll
- Copy AI responses
- Edit prompts
- Regenerate responses
- Clear conversation
- Latest response emphasis
- Progressive fading of older messages

## 📊 Productivity Analytics

Automatically tracks:

- Meetings summarized
- Schedules generated
- AI conversations
- Estimated weekly time saved
- Most-used AI tool

## 🎨 User Experience

- Modern SaaS interface
- Fully responsive design
- Mobile-friendly navigation
- Collapsible sidebar
- Smooth animations
- Skeleton loading states
- Toast notifications
- Empty, loading, success, and error states
- Accessible UI components
- Responsible AI disclaimer

---

# 🛠️ Technologies and Tools Used

## Frontend

- React
- TypeScript
- Vite

## UI & Styling

- Tailwind CSS
- shadcn/ui
- Lucide React Icons
- Framer Motion
- Roboto Font

## Routing & State Management

- React Router
- React Hook Form
- TanStack Query

## Data Storage

- Local Storage

## Development Tools

- npm
- ESLint
- Prettier

## AI Integration

The application is structured for seamless integration with:

- OpenAI API
- Azure OpenAI
- OpenRouter
- Other OpenAI-compatible AI providers

---

# 🚀 Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ai-pa-productivity-assistant.git
```

## 2. Navigate to the Project Folder

```bash
cd ai-pa-productivity-assistant
```

## 3. Install Dependencies

Using npm:

```bash
npm install
```

Or Yarn:

```bash
yarn
```

Or pnpm:

```bash
pnpm install
```

## 4. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

Replace the placeholder with your API key or configure your preferred AI provider.

## 5. Start the Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

## 6. Build for Production

```bash
npm run build
```

## 7. Preview the Production Build

```bash
npm run preview
```

---

# 📂 Project Structure

```text
src/
├── assets/
├── components/
├── constants/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

---

# ♿ Accessibility

AI PA has been designed with accessibility best practices, including:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- WCAG-friendly color contrast
- ARIA labels
- Responsive touch targets

---

# 🤖 Responsible AI Notice

This application uses artificial intelligence to generate summaries, schedules, and workplace assistance based on user input. AI-generated content may contain inaccuracies or omissions and should not be considered legal, financial, medical, or other professional advice. Users should review and verify important information before acting on AI-generated outputs.

---

# 🔮 Future Enhancements

- User authentication
- Cloud synchronization
- Google Calendar integration
- Microsoft Outlook integration
- File uploads (PDF, DOCX, TXT)
- Export to PDF
- Team collaboration
- AI prompt customization
- Advanced analytics dashboard
- Multi-language support

---

# 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more information.

---

# 👨‍💻 Author

**Samme Mfeka**

Developed as a portfolio and assessment project to demonstrate skills in:

- Modern React development
- TypeScript
- Responsive UI/UX design
- Component-based architecture
- AI-powered application development
- Frontend best practices
- Accessible and scalable web application development


