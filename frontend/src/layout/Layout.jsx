import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Layout({ children, user, onLogout, onConfig }) {
  return (
    <div className="flex min-h-screen bg-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} onLogout={onLogout} onConfig={onConfig} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
} 