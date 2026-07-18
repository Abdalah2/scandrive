import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import PrivateRoute from './PrivateRoute';
import { LandingPage, CarListPage, CarDetailPage, ShowroomScanPage, LoginPage, RegisterPage, ContactPage, ForbiddenPage, NotFoundPage } from '../pages/public';
import { ClientDashboard, FavoritesPage, ComparePage, RdvPage, MessagesPage, ClientProfilePage } from '../pages/client';
import { VendeurDashboard, MyCarsPage, VendeurRdvPage, VendeurMessagesPage } from '../pages/vendeur';
import { AdminDashboard, ManageCarsPage, ManageUsersPage, ManageAgencesPage, StatsPage, QRGeneratorPage } from '../pages/admin';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="cars" element={<CarListPage />} />
        <Route path="showroom" element={<ShowroomScanPage />} />
        <Route path="car/:id" element={<CarDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="forbidden" element={<ForbiddenPage />} />
      </Route>

      <Route path="client" element={<PrivateRoute allowedRoles={['client']}><DashboardLayout /></PrivateRoute>}>
        <Route index element={<ClientDashboard />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="rdv" element={<RdvPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ClientProfilePage />} />
      </Route>

      <Route path="vendeur" element={<PrivateRoute allowedRoles={['vendeur']}><DashboardLayout /></PrivateRoute>}>
        <Route index element={<VendeurDashboard />} />
        <Route path="cars" element={<MyCarsPage />} />
        <Route path="rdv" element={<VendeurRdvPage />} />
        <Route path="messages" element={<VendeurMessagesPage />} />
      </Route>

      <Route path="admin" element={<PrivateRoute allowedRoles={['admin']}><DashboardLayout /></PrivateRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<ManageCarsPage />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="agencies" element={<ManageAgencesPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="qr" element={<QRGeneratorPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}