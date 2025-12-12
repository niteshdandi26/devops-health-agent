# 🚀 DevOps Health Monitor - Vercel Deployment

**AI-Powered Autonomous Log Analysis System**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

---

## 🎯 Quick Start - Deploy to Vercel

### Backend API Deployment

1. **Import to Vercel**
   - Root Directory: `api`
   - Framework: Other
   
2. **Environment Variables**
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

3. **Deploy!** → Get your API URL

### Frontend Deployment

1. **Import to Vercel**
   - Root Directory: `frontend`
   - Framework: Next.js
   
2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

3. **Deploy!** → Get your dashboard URL

---

## 📁 Project Structure

```
devops-health-agent/
├── api/                    # Backend API (FastAPI + GROQ)
│   ├── main.py            # FastAPI application
│   ├── index.py           # Vercel entry point
│   ├── vercel.json        # Vercel config
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment template
│
├── frontend/              # Frontend Dashboard (Next.js)
│   ├── app/
│   │   ├── page.tsx       # Main dashboard
│   │   └── api/upload/    # File upload API
│   ├── .env.local.example # Environment template
│   └── package.json
│
├── agent/                 # AI Agent Logic
│   └── health_agent.py    # GROQ-powered analyzer
│
└── kestra-workflow.yml    # Automation workflow
```

---

## 🔧 Technologies Used

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: FastAPI, Python 3.11+
- **AI**: GROQ (Llama 3.3 70B)
- **Deployment**: Vercel Serverless
- **Orchestration**: Kestra

---

## ✨ Features

✅ **AI-Powered Log Analysis** - GROQ analyzes errors instantly
✅ **File Upload** - Users can upload their own log files
✅ **Real-time Dashboard** - Live monitoring interface
✅ **Serverless Architecture** - Scales automatically
✅ **Vercel Deployment** - One-click deploy

---

## 📖 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

---

## 🎉 Demo

**Live Demo**: [your-app.vercel.app](https://your-app.vercel.app)

**Features to Show**:
- Click "Refresh" for AI analysis
- Upload a `.log` file for instant analysis
- View error detection, root cause, and solutions

---

## 🏆 Hackathon Highlights

- ✅ **Vercel Sponsor Integration** - Full-stack Vercel deployment
- ✅ **AI-Powered** - GROQ for lightning-fast inference
- ✅ **Production Ready** - Actually deployed and working
- ✅ **User-Friendly** - File upload + real-time analysis

---

## 📝 License

MIT License - Built for Hackathon
