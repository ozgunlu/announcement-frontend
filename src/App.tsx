import React from 'react';
import logo from './logo.svg';
import './App.css';
import AnnouncementList from './components/AnnouncementList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Announcements</h1>
      </header>
      <main>
        <AnnouncementList />
      </main>
    </div>
  );
}

export default App;
