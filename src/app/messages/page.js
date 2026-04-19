"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HeroCard from '../components/HeroCard';

export default function Messages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchConversations();
      fetchUsers();
    }
  }, [status, router]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users/list');
      if (res.ok) {
        const data = await res.json();
        // Filter out current user
        const otherUsers = data.filter(u => u.email !== session?.user?.email);
        setUsers(otherUsers);
        if (otherUsers.length > 0) {
          setSelectedUser(otherUsers[0].name);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !selectedUser) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverName: selectedUser,
          content: messageContent
        })
      });

      if (res.ok) {
        setMessageContent('');
        fetchConversations();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <HeroCard
        label="INTERACTION / MESSAGING"
        title="Keep support moving through direct communication."
        description="Basic messaging gives helpers and requesters a clear follow-up path once a match happens."
        className="pb-16 pt-12"
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-2 items-start">
        {/* Conversation Stream */}
        <div className="w-full lg:w-[60%] bg-[#FCFAEF] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F2EFE1] lg:-mt-10 lg:sticky top-8 relative z-10">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">CONVERSATION STREAM</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Recent messages
          </h2>

          <div className="space-y-4">
            {conversations.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No messages yet. Start a conversation!</p>
              </div>
            ) : (
              conversations.map((conv, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold">
                        {conv.lastMessage.sender?.name?.charAt(0) || '?'}
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        {conv.lastMessage.sender?.name === session?.user?.name
                          ? `You → ${conv.partner.name}`
                          : `${conv.lastMessage.sender?.name} → You`
                        }
                      </p>
                      {conv.unread && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-10">{conv.lastMessage.content}</p>
                  </div>
                  <div className="bg-[#E4F3F0] text-brand-primary rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0 text-xs font-bold p-2 text-center leading-tight shadow-sm">
                    {formatTime(conv.lastMessage.createdAt).split(' ').map((part, i) => (
                      <span key={i} className="block">{part}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Send Message Form */}
        <div className="w-full lg:w-[40%] bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-brand-primary text-[10px] font-bold tracking-widest uppercase mb-4">SEND MESSAGE</p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            Start a conversation
          </h2>

          <form onSubmit={handleSendMessage} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none appearance-none font-medium"
              >
                {users.map(user => (
                  <option key={user._id} value={user.name}>{user.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 pb-6">
              <label className="text-sm font-bold text-gray-700">Message</label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Share support details, ask for files, or suggest next steps."
                required
                className="w-full bg-white border border-gray-200 text-gray-900 text-base rounded-2xl focus:ring-brand-primary focus:border-brand-primary block p-4 outline-none min-h-[140px] resize-none font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending || !messageContent.trim()}
              className="w-full bg-brand-primary hover:bg-emerald-700 text-white font-bold rounded-full text-base px-5 py-4 text-center transition-colors shadow-sm disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
