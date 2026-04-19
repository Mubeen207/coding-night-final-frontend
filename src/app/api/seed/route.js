import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Request from "@/models/Request";
import Notification from "@/models/Notification";
import Message from "@/models/Message";
import bcrypt from "bcrypt";

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Request.deleteMany({});
    await Notification.deleteMany({});
    await Message.deleteMany({});

    // Create sample users with hashed passwords
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Ayesha Khan",
        email: "ayesha@example.com",
        password: hashedPassword,
        role: "Both",
        location: "Karachi",
        skills: ["React", "JavaScript", "Node.js"],
        interests: ["Web Development", "Open Source"],
        trustScore: 98,
        contributions: 12,
        badges: ["Top Mentor", "Community Voice"]
      },
      {
        name: "Ali Ahmed",
        email: "ali@example.com",
        password: hashedPassword,
        role: "Can Help",
        location: "Lahore",
        skills: ["Python", "Data Analysis", "Machine Learning"],
        interests: ["AI", "Data Science"],
        trustScore: 95,
        contributions: 8,
        badges: ["Code Rescuer"]
      },
      {
        name: "Fatima Hassan",
        email: "fatima@example.com",
        password: hashedPassword,
        role: "Both",
        location: "Islamabad",
        skills: ["Figma", "UI/UX", "Adobe XD"],
        interests: ["Design", "User Experience"],
        trustScore: 92,
        contributions: 15,
        badges: ["Bug Hunter", "Community Voice"]
      },
      {
        name: "Usman Tariq",
        email: "usman@example.com",
        password: hashedPassword,
        role: "Need Help",
        location: "Karachi",
        skills: ["HTML", "CSS", "JavaScript"],
        interests: ["Learning", "Frontend"],
        trustScore: 85,
        contributions: 3,
        badges: ["Rising Star"]
      },
      {
        name: "Zara Iqbal",
        email: "zara@example.com",
        password: hashedPassword,
        role: "Can Help",
        location: "Remote",
        skills: ["React", "Next.js", "Tailwind CSS"],
        interests: ["Full Stack", "Teaching"],
        trustScore: 96,
        contributions: 20,
        badges: ["Top Mentor", "Community Voice"]
      },
      {
        name: "Bilal Raza",
        email: "bilal@example.com",
        password: hashedPassword,
        role: "Both",
        location: "Lahore",
        skills: ["Node.js", "MongoDB", "Express"],
        interests: ["Backend", "API Development"],
        trustScore: 88,
        contributions: 6,
        badges: ["Code Rescuer"]
      },
      {
        name: "Sara Malik",
        email: "sara@example.com",
        password: hashedPassword,
        role: "Need Help",
        location: "Karachi",
        skills: ["Python", "Beginner"],
        interests: ["Learning Python", "Data Science"],
        trustScore: 75,
        contributions: 1,
        badges: []
      },
      {
        name: "Hamza Sheikh",
        email: "hamza@example.com",
        password: hashedPassword,
        role: "Can Help",
        location: "Islamabad",
        skills: ["Career Coaching", "Resume Review", "Interview Prep"],
        interests: ["Mentoring", "Career Development"],
        trustScore: 94,
        contributions: 10,
        badges: ["Community Voice"]
      }
    ]);

    // Get user IDs for requests
    const ayeshId = users[0]._id;
    const aliId = users[1]._id;
    const fatimaId = users[2]._id;
    const usmanId = users[3]._id;
    const zaraId = users[4]._id;
    const bilalId = users[5]._id;
    const saraId = users[6]._id;
    const hamzaId = users[7]._id;

    // Create sample requests
    const requests = await Request.insertMany([
      {
        title: "Need help making my portfolio responsive before demo day",
        description: "I built a portfolio site using HTML and CSS but it looks terrible on mobile. I have a demo day tomorrow and really need help with media queries and responsive layout. The navigation breaks on small screens and images overflow.",
        category: "Web Development",
        urgency: "High",
        tags: ["CSS", "Responsive", "Mobile", "Urgent"],
        status: "Open",
        requester: usmanId,
        helpers: [zaraId, ayeshId]
      },
      {
        title: "Looking for Figma feedback on a volunteer event poster",
        description: "I've designed a poster for a volunteer recruitment event but I'm not sure about the visual hierarchy. Need feedback on typography, spacing, and whether the call-to-action is clear enough.",
        category: "Design",
        urgency: "Medium",
        tags: ["Figma", "UI Design", "Typography", "Feedback"],
        status: "Open",
        requester: aliId,
        helpers: [fatimaId]
      },
      {
        title: "Need mock interview support for internship applications",
        description: "I'm applying for frontend internships and feeling nervous about technical interviews. Looking for someone to do a mock interview with me and give feedback on my answers. I struggle with behavioral questions.",
        category: "Career",
        urgency: "Medium",
        tags: ["Interview", "Career", "Frontend", "Mentoring"],
        status: "Open",
        requester: saraId,
        helpers: [hamzaId, ayeshId]
      },
      {
        title: "Debugging a React component that's not re-rendering",
        description: "I have a React component that receives new props but doesn't re-render. I've tried useEffect but it's still not working. The component displays user data fetched from an API.",
        category: "Web Development",
        urgency: "High",
        tags: ["React", "Debugging", "JavaScript", "Hooks"],
        status: "Solved",
        requester: saraId,
        helpers: [zaraId, ayeshId, bilalId]
      },
      {
        title: "Help setting up MongoDB Atlas connection",
        description: "I'm trying to connect my Node.js app to MongoDB Atlas but keep getting connection errors. I've whitelisted my IP and have the correct connection string. Not sure what's wrong.",
        category: "Web Development",
        urgency: "High",
        tags: ["MongoDB", "Node.js", "Backend", "Database"],
        status: "Open",
        requester: usmanId,
        helpers: [bilalId]
      },
      {
        title: "Career advice: Frontend vs Full Stack path",
        description: "I'm currently learning frontend development but wondering if I should expand to full stack. What are the pros and cons? Which has better job prospects in Pakistan? Looking for experienced developers' perspectives.",
        category: "Career",
        urgency: "Low",
        tags: ["Career Advice", "Frontend", "Full Stack", "Planning"],
        status: "Open",
        requester: usmanId,
        helpers: [zaraId, hamzaId]
      },
      {
        title: "Review my Python data analysis script",
        description: "I wrote a Python script to analyze sales data using pandas. It works but I think it could be more efficient. Looking for code review and suggestions for improvement. Uses pandas and matplotlib.",
        category: "Web Development",
        urgency: "Low",
        tags: ["Python", "Pandas", "Data Analysis", "Code Review"],
        status: "Solved",
        requester: saraId,
        helpers: [aliId]
      },
      {
        title: "Logo design for a community coding event",
        description: "We're organizing a coding night and need a logo. The event is called 'Code & Coffee' and focuses on collaborative learning. Looking for something modern and welcoming that works on social media.",
        category: "Design",
        urgency: "Medium",
        tags: ["Logo Design", "Branding", "Community", "Creative"],
        status: "Open",
        requester: ayeshId,
        helpers: [fatimaId]
      },
      {
        title: "Help with Next.js routing and dynamic pages",
        description: "I'm building a blog with Next.js and having trouble with dynamic routes. The blog posts should be at /blog/[slug] but I'm getting 404 errors. Using the app router.",
        category: "Web Development",
        urgency: "High",
        tags: ["Next.js", "Routing", "Dynamic Pages", "Help"],
        status: "Open",
        requester: saraId,
        helpers: [zaraId]
      },
      {
        title: "Feedback on my tech resume - junior developer",
        description: "I'm a recent graduate looking for my first developer job. Would appreciate feedback on my resume - is the format good? Should I include my bootcamp projects? How do I highlight transferable skills from my previous non-tech job?",
        category: "Career",
        urgency: "Medium",
        tags: ["Resume", "Career", "Junior Developer", "Feedback"],
        status: "Solved",
        requester: usmanId,
        helpers: [hamzaId, ayeshId]
      }
    ]);

    // Create sample notifications
    await Notification.insertMany([
      {
        userId: usmanId,
        message: "Zara Iqbal offered help on your portfolio request",
        type: "Match",
        isRead: false
      },
      {
        userId: usmanId,
        message: "Ayesha Khan offered help on your portfolio request",
        type: "Match",
        isRead: false
      },
      {
        userId: saraId,
        message: "Your debugging request was marked as solved",
        type: "Status",
        isRead: true
      },
      {
        userId: saraId,
        message: "Zara Iqbal offered help on your React debugging request",
        type: "Match",
        isRead: true
      },
      {
        userId: saraId,
        message: "Your trust score increased by 5 points!",
        type: "Reputation",
        isRead: false
      },
      {
        userId: ayeshId,
        message: "Welcome to HelpHub AI! Your profile is set up.",
        type: "Insight",
        isRead: true
      },
      {
        userId: ayeshId,
        message: "You earned the 'Top Mentor' badge!",
        type: "Reputation",
        isRead: false
      },
      {
        userId: aliId,
        message: "Fatima Hassan commented on your Figma design request",
        type: "Match",
        isRead: false
      },
      {
        userId: zaraId,
        message: "Trending: High demand for React mentors this week",
        type: "Insight",
        isRead: true
      },
      {
        userId: fatimaId,
        message: "Your design received positive feedback from the community",
        type: "Reputation",
        isRead: false
      }
    ]);

    // Create sample messages
    await Message.insertMany([
      {
        sender: zaraId,
        receiver: usmanId,
        content: "Hi! I saw your request about responsive portfolio. I'd be happy to help. Can you share a link to your current version?",
        isRead: true
      },
      {
        sender: usmanId,
        receiver: zaraId,
        content: "Thanks for offering to help! Here's the link: https://myportfolio-demo.vercel.app The main issue is the navigation on mobile.",
        isRead: true
      },
      {
        sender: zaraId,
        receiver: usmanId,
        content: "I see the problem! Your nav needs a hamburger menu for mobile. Also, the images need max-width: 100%. I can help you implement these fixes. When do you need this done?",
        isRead: false
      },
      {
        sender: ayeshId,
        receiver: usmanId,
        content: "I can also help with your portfolio! I've built many responsive sites. Let me know if you need a second opinion.",
        isRead: false
      },
      {
        sender: fatimaId,
        receiver: aliId,
        content: "Hey! I looked at your poster design. The overall layout is good, but I'd suggest making the call-to-action button larger and using a more contrasting color. Also, the text hierarchy could be improved by increasing the headline size.",
        isRead: true
      },
      {
        sender: aliId,
        receiver: fatimaId,
        content: "Thank you so much for the feedback! Those are great points. I'll make those adjustments and send you the updated version.",
        isRead: true
      },
      {
        sender: hamzaId,
        receiver: saraId,
        content: "Hi Sara! I'm available for a mock interview this weekend. Do you have a specific company or role in mind that you're preparing for?",
        isRead: true
      },
      {
        sender: saraId,
        receiver: hamzaId,
        content: "Hi Hamza! Yes, I'm interviewing for a frontend position at a startup. They mentioned React and TypeScript in the job description. I'm most nervous about the technical questions.",
        isRead: false
      },
      {
        sender: bilalId,
        receiver: usmanId,
        content: "About your MongoDB connection issue - have you checked if your IP whitelist is set to 'allow access from anywhere'? Sometimes local IPs change. Also, make sure you're using the correct database name in your connection string.",
        isRead: false
      },
      {
        sender: ayeshId,
        receiver: fatimaId,
        content: "Fatima, love the logo concepts you shared! The coffee cup + code bracket idea is brilliant. Can't wait to see the final version for our Code & Coffee event!",
        isRead: true
      }
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      users: users.length,
      requests: requests.length,
      demoAccounts: [
        { email: "ayesha@example.com", password: "password123" },
        { email: "ali@example.com", password: "password123" },
        { email: "zara@example.com", password: "password123" }
      ]
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
