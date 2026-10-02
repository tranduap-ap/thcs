import React from 'react';
import {
  Trophy,
  TableProperties,
  Clock,
  SunMoon,
  BarChart3,
  Users,
  PlusCircle,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  Settings,
  GraduationCap,
  Sparkles,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { WeekInfo, ClassMetadata, UserAccount } from '../types/discipline';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  metadata: ClassMetadata;
  weeks: WeekInfo[];
  currentWeekId: number;
  currentAccount?: UserAccount;
  onSelectWeek: (weekId: number) => void;
  onOpenQuickEntry: () => void;
  onOpenClassRoster: () => void;
  onOpenImportRoster: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  metadata,
  weeks,
  currentWeekId,
  currentAccount,
  onSelectWeek,
  onOpenQuickEntry,
  onOpenClassRoster,
  onOpenImportRoster,
  onOpenSettings,
  onOpenPrint,
  onOpenAuthModal,
  onLogout,
}) => {
  const currentWeek = weeks.find((w) => w.id === currentWeekId) || weeks[0];

  const navItems = [
    { id: 'competition', label: 'Thi đua 6 nhóm', icon: Trophy },
    { id: 'weeklyTable', label: 'Sổ nề nếp tuần', icon: TableProperties },
    { id: 'morningDuty', label: '15p đầu giờ', icon: Clock },
    { id: 'afternoon', label: 'Học trái buổi', icon: SunMoon },
    { id: 'reports', label: 'Thống kê & Báo cáo', icon: BarChart3 },
  ];

  const isLoggedIn = currentAccount && currentAccount.role !== 'guest';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Hàng 1: Brand Logo + Thông Tin Lớp Học + Nhóm Nút Tác Vụ Chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
        {/* Brand Zone: Huy hiệu lớp + Tiêu đề + Metadata unboxed chuẩn mỹ thuật */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          {/* Logo / Huy hiệu lớp học */}
          <div
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-amber-300 flex flex-col items-center justify-center font-bold shadow-xs border border-indigo-700/60 cursor-pointer hover:border-amber-400 hover:scale-105 transition-all shrink-0 group"
            title="Bấm để chỉnh sửa thông tin trường, lớp, GVCN"
          >
            <GraduationCap className="w-5 h-5 text-amber-300 group-hover:rotate-6 transition-transform" />
            <span className="text-[10px] font-black text-amber-200 -mt-0.5 leading-none">
              {metadata.className}
            </span>
          </div>

          <div className="min-w-0">
            {/* Dòng 1: Tiêu đề chính + Badge Lớp + Nút cài đặt */}
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-2">
                <span>SỔ NỀ NẾP VÀ THI ĐUA</span>
                <span className="inline-block px-2 py-0.5 bg-indigo-700 text-white text-[11px] font-black rounded-md shadow-2xs">
                  LỚP {metadata.className}
                </span>
              </h1>
              <button
                onClick={onOpenSettings}
                className="text-slate-400 hover:text-indigo-700 p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                title="Chỉnh sửa thông tin trường, lớp, năm học, GVCN"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dòng 2: Metadata trang trọng, rõ nét, phân tách tinh tế bằng dấu chấm trung tâm */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-slate-500 whitespace-nowrap flex-wrap mt-0.5">
              <span
                onClick={onOpenSettings}
                className="font-semibold text-slate-700 hover:text-indigo-700 cursor-pointer flex items-center gap-1"
                title="Bấm để đổi tên trường"
              >
                <span>🏛️</span>
                <span>{metadata.schoolName || 'TRƯỜNG THCS LÊ QUÝ ĐÔN'}</span>
              </span>
              <span className="text-slate-300 font-bold">·</span>
              <span className="text-slate-600 font-medium">
                NH {metadata.academicYear || '2026 - 2027'} ({metadata.semester === 2 ? 'HK II' : 'HK I'})
              </span>
              <span className="text-slate-300 font-bold">·</span>
              <span className="text-slate-700 font-medium flex items-center gap-1">
                <span>👩‍🏫 GVCN:</span>
                <strong
                  onClick={onOpenSettings}
                  className="font-bold text-slate-900 hover:text-indigo-700 cursor-pointer"
                  title="Bấm để đổi tên GVCN"
                >
                  {metadata.homeroomTeacher}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Zone: Tinh gọn, phân cấp rõ rệt, màu sắc hài hòa */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Chọn tuần học */}
          <div className="relative">
            <select
              value={currentWeekId}
              onChange={(e) => onSelectWeek(Number(e.target.value))}
              aria-label="Chọn tuần học"
              className="appearance-none bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold py-2 pl-3 pr-7 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {weeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Nút Nhập danh sách học sinh (đổi từ Chèn DS lớp theo yêu cầu) */}
          <button
            onClick={onOpenImportRoster}
            title="Nhập file Excel danh sách học sinh & Tự động chia 6 nhóm thi đua"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
            <span>Nhập danh sách học sinh</span>
          </button>

          {/* Nút Ghi nhận vi phạm */}
          <button
            onClick={onOpenQuickEntry}
            title="Ghi nhận nhanh vi phạm hoặc cộng điểm thi đua"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer hover:shadow-indigo-200"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Ghi nhận vi phạm</span>
            <span className="sm:hidden">Ghi nhận</span>
          </button>

          {/* Nhóm nút công cụ nhỏ (In ấn, Danh sách lớp, Cài đặt) */}
          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={onOpenPrint}
              title="In / Xuất phiếu nề nếp A4 chuẩn thi đua"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenClassRoster}
              title="Danh sách học sinh & 6 Nhóm"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Cài đặt thông tin lớp, trường, năm học, GVCN"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Nút Đăng nhập / Tài khoản nhỏ gọn */}
          {isLoggedIn && currentAccount ? (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={onOpenAuthModal}
                title={`Đang đăng nhập: ${currentAccount.title} (@${currentAccount.username}). Bấm để xem hoặc đổi tài khoản.`}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer max-w-[150px]"
              >
                <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">{currentAccount.title}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Đăng xuất tất cả các tài khoản (quay về chế độ chỉ xem)"
                  className="p-1.5 text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : onOpenAuthModal ? (
            <button
              onClick={onOpenAuthModal}
              title="Đăng nhập tài khoản ban cán sự lớp / GVCN"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Đăng nhập</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Hàng 2: Thanh điều hướng 5 phân hệ chuyên sâu (Luôn hiển thị rõ nét trên mọi kích thước màn hình) */}
      <div className="border-t border-slate-200 bg-slate-50/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

