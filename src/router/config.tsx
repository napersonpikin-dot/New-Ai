import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import HowItWorks from "../pages/how-it-works/page";
import DashboardSettings from "../pages/dashboard/settings/page";
import AdminPanel from "../pages/admin/page";
import FinanceApprovalPage from "../pages/admin/finance-approval/page";
import MemberDashboard from "../pages/dashboard/page";
import ContactPage from "../pages/contact/page";
import EarningsPage from "../pages/earnings/page";
import ReferralPage from "../pages/referral/page";
import LeaderboardPage from "../pages/leaderboard/page";
import AffiliatePage from "../pages/affiliate/page";
import ActivityFeedPage from "../pages/activity/page";
import CommunityChatPage from "../pages/community/page";
import MemberProfilePage from "../pages/member/page";
import KycPage from "../pages/kyc/page";
import MyReferralsPage from "../pages/my-referrals/page";
import NotificationsPage from "../pages/notifications/page";
import MyOrdersPage from "../pages/my-orders/page";
import MyWithdrawalsPage from "../pages/my-withdrawals/page";
import MyLoansPage from "../pages/my-loans/page";
import ActivateAIPage from "../pages/activate-ai/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/activate-ai",
    element: <ActivateAIPage />,
  },
  {
    path: "/earnings",
    element: <EarningsPage />,
  },
  {
    path: "/referral",
    element: <ReferralPage />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/affiliate",
    element: <AffiliatePage />,
  },
  {
    path: "/activity",
    element: <ActivityFeedPage />,
  },
  {
    path: "/community",
    element: <CommunityChatPage />,
  },
  {
    path: "/member/:handle",
    element: <MemberProfilePage />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/dashboard",
    element: <MemberDashboard />,
  },
  {
    path: "/dashboard/settings",
    element: <DashboardSettings />,
  },
  {
    path: "/admin",
    element: <AdminPanel />,
  },
  {
    path: "/admin/finance-approval",
    element: <FinanceApprovalPage />,
  },
  {
    path: "/kyc",
    element: <KycPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/my-referrals",
    element: <MyReferralsPage />,
  },
  {
    path: "/my-orders",
    element: <MyOrdersPage />,
  },
  {
    path: "/my-loans",
    element: <MyLoansPage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/my-withdrawals",
    element: <MyWithdrawalsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
