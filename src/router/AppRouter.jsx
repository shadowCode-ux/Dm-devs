import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import PrivateRoute from '../components/auth/PrivateRoute.jsx'
import AdminRoute from '../components/auth/AdminRoute.jsx'

import Home from '../pages/Home/Home.jsx'
import Learn from '../pages/Learn/Learn.jsx'
import Quiz from '../pages/Quiz/Quiz.jsx'
import About from '../pages/About/About.jsx'
import Community from '../pages/Community/Community.jsx'
import Resources from '../pages/Resources/Resources.jsx'
import Rules from '../pages/Rules/Rules.jsx'
import Team from '../pages/Team/Team.jsx'
import FAQ from '../pages/FAQ/FAQ.jsx'
import Contact from '../pages/Contact/Contact.jsx'
import Projects from '../pages/Platform/Projects/Projects.jsx'
import Leaderboard from '../pages/Platform/Leaderboard/Leaderboard.jsx'
import Docs from '../pages/Platform/Docs/Docs.jsx'
import Support from '../pages/Platform/Support/Support.jsx'
import AuthPage from '../pages/Auth/AuthPage.jsx'
import Overview from '../pages/Dashboard/Overview/Overview.jsx'
import DashboardProjects from '../pages/Dashboard/Projects/DashboardProjects.jsx'
import DashboardAnalytics from '../pages/Dashboard/Analytics/DashboardAnalytics.jsx'
import DashboardDiscovery from '../pages/Dashboard/Discovery/DashboardDiscovery.jsx'
import AddProject from '../pages/Dashboard/AddProject/AddProject.jsx'
import Settings from '../pages/Dashboard/Settings/Settings.jsx'
import PublicProfile from '../pages/Dashboard/Profile/PublicProfile.jsx'
import DashboardAdmin from '../pages/Dashboard/Admin/DashboardAdmin.jsx'
import DashboardPremium from '../pages/Dashboard/Premium/DashboardPremium.jsx'

// Temporary placeholder — dashboard sub-pages not yet built
function Placeholder({ name }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-white font-heading text-2xl">
      {name} page — coming soon
    </div>
  )
}

function AppRouter() {
  return (
    <Routes>
      {/* Public marketing site — Navbar + Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/team" element={<Team />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/platform/projects" element={<Projects />} />
        <Route path="/platform/leaderboard" element={<Leaderboard />} />
        <Route path="/platform/docs" element={<Docs />} />
        <Route path="/platform/support" element={<Support />} />

        <Route path="*" element={<Placeholder name="404 Not Found" />} />
      </Route>

      {/* Standalone auth pages — no marketing chrome */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      {/* Protected member area — DashboardLayout, guarded by PrivateRoute */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/projects" element={<DashboardProjects />} />
          <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
          <Route path="/dashboard/discovery" element={<DashboardDiscovery />} />
          <Route path="/dashboard/add-project" element={<AddProject />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile/:id" element={<PublicProfile />} />
          <Route path="/dashboard/premium" element={<DashboardPremium />} />

          {/* Owner/admin-only moderation area */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
