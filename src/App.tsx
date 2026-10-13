/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClassDataProvider, useClassData } from './context/ClassDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Classroom3D } from './components/Classroom3D';
import { StudentProfiles } from './components/StudentProfiles';
import { StudentModal } from './components/StudentModal';
import { MemoriesSection } from './components/MemoriesSection';
import { GallerySection } from './components/GallerySection';
import { AboutSection } from './components/AboutSection';
import { MemoryWall } from './components/MemoryWall';
import { MusicPlayer } from './components/MusicPlayer';
import { LightboxModal } from './components/LightboxModal';
import { AdminModal } from './components/AdminModal';
import { WelcomeBanner } from './components/WelcomeBanner';
import { Footer } from './components/Footer';
import { Student, Memory } from './types';

const MainContent: React.FC = () => {
  const { selectedStudent, setSelectedStudent } = useClassData();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminTargetStudentId, setAdminTargetStudentId] = useState<string | null>(null);

  const handleEnterClassroom = () => {
    const el = document.getElementById('classroom');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreStudents = () => {
    const el = document.getElementById('students');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAdminWithStudent = (student: Student) => {
    setAdminTargetStudentId(student.id);
    setIsAdminModalOpen(true);
  };

  const handleAddMemory = () => {
    setIsAdminModalOpen(true);
  };

  const handleEditMemory = (memory: Memory) => {
    setIsAdminModalOpen(true);
  };

  const handleAddPhoto = () => {
    setIsAdminModalOpen(true);
  };

  const handleEditClassInfo = () => {
    setIsAdminModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Navbar onOpenAdmin={() => setIsAdminModalOpen(true)} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onEnterClassroom={handleEnterClassroom}
          onExploreStudents={handleExploreStudents}
        />

        {/* 2. Interactive 3D Classroom (The cornerstone feature) */}
        <Classroom3D />

        {/* 3. Individual Student Profiles (14 Students) */}
        <StudentProfiles onEditStudent={handleOpenAdminWithStudent} />

        {/* 4. Memories & Digital Yearbook */}
        <MemoriesSection
          onAddMemory={handleAddMemory}
          onEditMemory={handleEditMemory}
        />

        {/* 5. Class Photo Gallery */}
        <GallerySection onAddPhoto={handleAddPhoto} />

        {/* 6. Interactive Memory Wall */}
        <MemoryWall />

        {/* 7. About Our Class & Stats */}
        <AboutSection onEditClassInfo={handleEditClassInfo} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />

      {/* Persistent Modals & Widgets */}
      <StudentModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEditStudent={handleOpenAdminWithStudent}
      />

      <LightboxModal />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setAdminTargetStudentId(null);
        }}
        initialSelectedStudentId={adminTargetStudentId}
      />

      <MusicPlayer />

      <WelcomeBanner onEnter={handleEnterClassroom} />
    </div>
  );
};

export default function App() {
  return (
    <ClassDataProvider>
      <MainContent />
    </ClassDataProvider>
  );
}
