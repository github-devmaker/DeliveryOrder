import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlanPage from "./pages/PlanPage";
import NotFound from "./pages/NotFound";
import MainLayout from "./pages/MainLayout";
import SupplierPage from "./pages/SupplierPage";
import DoPoPage from "./pages/DoPoPage";
import PartPage from "./pages/PartPage";
import PoPage from "./pages/PoPage";
import DeliveryOfDayPage from "./pages/DeliveryOfDayPage";
import MainPage from "./pages/MainPage";
const Routers = () => {
    const VITE_BASE_PATH = 'DeliveryOrderApp'
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path={VITE_BASE_PATH + '/'} element={<PlanPage />} />
                    <Route path={VITE_BASE_PATH + '/plan'} element={<PlanPage />} />
                    <Route path={VITE_BASE_PATH + '/supplier'} element={<SupplierPage />} />
                    <Route path={VITE_BASE_PATH + '/dopo'} element={<DoPoPage />} />
                    <Route path={VITE_BASE_PATH + '/part'} element={<PartPage />} />
                    <Route path={VITE_BASE_PATH + '/po'} element={<PoPage />} />
                    <Route path={VITE_BASE_PATH + '/delivery'} element={<DeliveryOfDayPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;