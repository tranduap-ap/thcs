import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  BookOpen,
  Sparkles,
  Award,
  ChevronDown,
  Check,
  PenTool,
  Info,
  KeyRound,
  Lock,
  LogOut,
  Settings2,
} from 'lucide-react';
import { UserRoleType, ClassMetadata, Student, UserAccount } from '../types/discipline';
import { getRolePermissionBadge } from '../utils/permissions';

interface RoleSwitcherProps {
  currentRole: UserRoleType;
  onSelectRole: (role: UserRoleType) => void;
  metadata: ClassMetadata;
  students: Student[];
  accounts: UserAccount[];
  currentAccountId: string;
  onOpenRoleRemarks: () => void;
  onOpenAuthModal: () => void;
  onOpenAccountManager: () => void;
  onLogout?: () => void;
}

export interface RoleInfo {
  id: UserRoleType;
  title: string;
  shortTitle: string;
  assignee: string;
  badgeColor: string;
  textColor: string;
  bgColor: string;
  icon: string;
  description: string;
  permissions: string[];
}

export function getRoleInfoList(metadata: ClassMetadata, students: Student[]): RoleInfo[] {
  // Tìm tên 6 nhóm trưởng từ danh sách học sinh
  const getLeaderName = (groupId: number, fallback: string) => {
    const leader = students.find((s) => s.groupId === groupId && s.isLeader);
    return leader ? leader.name : fallback;
  };

  return [
    {
      id: 'gvcn',
      title: 'Giáo viên Chủ nhiệm',
      shortTitle: 'GVCN',
      assignee: metadata.homeroomTeacher,
      badgeColor: 'border-purple-300 text-purple-700 bg-purple-50',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-600',
      icon: '👑',
      description: 'Toàn quyền quản trị, duyệt báo cáo thi đua tuần, quản lý tài khoản & chỉ đạo lớp.',
      permissions: ['Toàn quyền hệ thống', 'Phê duyệt sổ nề nếp', 'Cấu hình học sinh & nhóm', 'Quản lý tài khoản'],
    },
    {
      id: 'lopTruong',
      title: 'Lớp trưởng',
      shortTitle: 'Lớp trưởng',
      assignee: metadata.monitorName,
      badgeColor: 'border-indigo-300 text-indigo-700 bg-indigo-50',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-600',
      icon: '🎖️',
      description: 'Bao quát toàn lớp: được nhập mọi học sinh cả 6 nhóm, viết nhận xét chung tuần.',
      permissions: ['Tổng kết nề nếp toàn lớp', 'Ghi nhận mọi vi phạm cả 6 nhóm', 'Đánh giá thi đua 6 nhóm'],
    },
    {
      id: 'lopPhoHocTap',
      title: 'Lớp phó Học tập',
      shortTitle: 'LP Học tập',
      assignee: metadata.academicViceMonitorName || 'Nguyễn Thảo Linh',
      badgeColor: 'border-blue-300 text-blue-700 bg-blue-50',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-600',
      icon: '📚',
      description: 'Chuyên trách học tập: chỉ nhập KTB/KLB, phát biểu (+1đ), điểm tốt (+2đ), truy bài 15p.',
      permissions: ['Ghi nhận KTB/KLB/KSB', 'Cộng điểm tốt & phát biểu', 'Truy bài 15p đầu giờ'],
    },
    {
      id: 'lopPhoLaoDong',
      title: 'Lớp phó Lao động',
      shortTitle: 'LP Lao động',
      assignee: metadata.laborViceMonitorName || 'Bùi Quang Khải',
      badgeColor: 'border-emerald-300 text-emerald-700 bg-emerald-50',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-600',
      icon: '🧹',
      description: 'Chuyên trách vệ sinh: chỉ nhập trực VS bẩn, xả rác, không tham gia VS, tài sản lớp.',
      permissions: ['Ghi nhận trực VS bẩn', 'Xả rác / Hư hỏng tài sản', 'Vệ sinh 15p đầu giờ'],
    },
    {
      id: 'lopPhoTratTu',
      title: 'Lớp phó Trật tự',
      shortTitle: 'LP Trật tự',
      assignee: metadata.disciplineViceMonitorName || metadata.viceMonitorName || 'Lê Hoàng Yến Nhi',
      badgeColor: 'border-amber-300 text-amber-700 bg-amber-50',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-600',
      icon: '🛡️',
      description: 'Chuyên trách kỷ luật: chỉ nhập đi trễ, nghỉ học, bỏ tiết, đồng phục, mất trật tự, học trái buổi.',
      permissions: ['Ghi nhận chuyên cần & đi trễ', 'Đồng phục & khăn quàng', 'Điểm danh học trái buổi'],
    },
    {
      id: 'nhomTruong1',
      title: 'Nhóm trưởng 1',
      shortTitle: 'Tổ trưởng 1',
      assignee: getLeaderName(1, 'Nguyễn Văn An'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 1: Được phân công chấm chéo - chỉ được nhập học sinh Nhóm 2.',
      permissions: ['Chỉ nhập học sinh Nhóm 2 (chấm chéo)', 'Nhận xét tuần Nhóm 1'],
    },
    {
      id: 'nhomTruong2',
      title: 'Nhóm trưởng 2',
      shortTitle: 'Tổ trưởng 2',
      assignee: getLeaderName(2, 'Trần Gia Hưng'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 2: Chỉ được nhập các học sinh thuộc Nhóm 2.',
      permissions: ['Chỉ nhập học sinh Nhóm 2', 'Nhận xét tuần Nhóm 2'],
    },
    {
      id: 'nhomTruong3',
      title: 'Nhóm trưởng 3',
      shortTitle: 'Tổ trưởng 3',
      assignee: getLeaderName(3, 'Lê Hoàng Yến Nhi'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 3: Chỉ được nhập các học sinh thuộc Nhóm 3.',
      permissions: ['Chỉ nhập học sinh Nhóm 3', 'Nhận xét tuần Nhóm 3'],
    },
    {
      id: 'nhomTruong4',
      title: 'Nhóm trưởng 4',
      shortTitle: 'Tổ trưởng 4',
      assignee: getLeaderName(4, 'Phạm Thanh Tùng'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 4: Chỉ được nhập các học sinh thuộc Nhóm 4.',
      permissions: ['Chỉ nhập học sinh Nhóm 4', 'Nhận xét tuần Nhóm 4'],
    },
    {
      id: 'nhomTruong5',
      title: 'Nhóm trưởng 5',
      shortTitle: 'Tổ trưởng 5',
      assignee: getLeaderName(5, 'Hoàng Kim Cúc'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 5: Chỉ được nhập các học sinh thuộc Nhóm 5.',
      permissions: ['Chỉ nhập học sinh Nhóm 5', 'Nhận xét tuần Nhóm 5'],
    },
    {
      id: 'nhomTruong6',
      title: 'Nhóm trưởng 6',
      shortTitle: 'Tổ trưởng 6',
      assignee: getLeaderName(6, 'Đào Thu Hiền'),
      badgeColor: 'border-sky-300 text-sky-700 bg-sky-50',
      textColor: 'text-sky-700',
      bgColor: 'bg-sky-600',
      icon: '🚩',
      description: 'Nhóm trưởng 6: Chỉ được nhập các học sinh thuộc Nhóm 6.',
      permissions: ['Chỉ nhập học sinh Nhóm 6', 'Nhận xét tuần Nhóm 6'],
    },
  ];
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  metadata,
  students,
  accounts,
  currentAccountId,
  onOpenRoleRemarks,
  onOpenAuthModal,
  onOpenAccountManager,
  onLogout,
}) => {
  const roles = getRoleInfoList(metadata, students);
  const activeRole = roles.find((r) => r.id === currentRole);
  const activeAccount = accounts.find((a) => a.id === currentAccountId) || accounts.find((a) => a.role === currentRole);
  const badge = getRolePermissionBadge(currentRole, activeAccount?.assignedGroupIds);
  const isLoggedIn = currentRole !== 'guest' && !!activeAccount;

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Vai trò đang hoạt động */}
        <div className="flex items-center flex-wrap gap-2.5 min-w-0">
          <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tài khoản:</span>
          </span>

          {/* Huy hiệu tài khoản hiện tại (Đã bỏ danh sách chọn nhanh tài khoản theo yêu cầu) */}
          {isLoggedIn && activeAccount ? (
            <div
              className="flex items-center gap-2 bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs"
              title={`Đang đăng nhập: ${activeAccount.title} (@${activeAccount.username})`}
            >
              <span>{activeAccount.avatarIcon || activeRole?.icon || '👤'}</span>
              <span className="font-extrabold">{activeAccount.title}</span>
              <span className="text-indigo-700 font-bold hidden sm:inline">
                (@{activeAccount.username})
              </span>
              <span className="text-slate-500 font-normal hidden lg:inline">
                - {activeAccount.displayName}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-900 font-bold px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs">
              <span>🔒</span>
              <span className="font-extrabold">Chưa đăng nhập</span>
              <span className="text-amber-700 font-medium hidden sm:inline">(Chế độ chỉ xem)</span>
            </div>
          )}

          {/* Badge quyền hạn */}
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${badge.badgeColor}`}>
            {badge.badgeText}
          </span>

          {/* Mô tả quyền chuyên trách */}
          <span className="text-slate-600 text-[11px] truncate max-w-sm hidden xl:inline">
            {badge.scopeText}
          </span>
        </div>

        {/* Nút tác vụ phân quyền & nhận xét & đăng xuất */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Nút Đăng nhập / Đổi tài khoản */}
          {isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
              title="Đăng nhập tài khoản khác"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Đổi tài khoản</span>
              <span className="sm:hidden">Đổi TK</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-xs"
              title="Đăng nhập tài khoản bằng tên đăng nhập và mật khẩu"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>Đăng nhập tài khoản</span>
            </button>
          )}

          {/* Nút Đăng xuất tất cả các tài khoản: Hiển thị khi đang đăng nhập */}
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
              title="Đăng xuất tất cả các tài khoản (quay về chế độ chỉ xem)"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Đăng xuất tất cả các tài khoản</span>
            </button>
          )}

          {/* Nút Quản lý 11 tài khoản: CHỈ HIỂN THỊ VỚI GVCN */}
          {currentRole === 'gvcn' && (
            <button
              onClick={onOpenAccountManager}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg font-bold transition-colors cursor-pointer shadow-2xs"
              title="Cài đặt tên đăng nhập, mật khẩu và phân quyền 11 tài khoản (Dành riêng cho GVCN)"
            >
              <Settings2 className="w-3.5 h-3.5 text-purple-700" />
              <span className="hidden md:inline">Quản lý MK</span>
            </button>
          )}

          {/* Nút Nhập Nhận Xét & Báo Cáo Tuần của Cán Bộ Lớp */}
          <button
            onClick={onOpenRoleRemarks}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Sổ Nhận Xét 6 Nhóm & Cán Sự</span>
            <span className="sm:hidden">Sổ Nhận Xét</span>
          </button>
        </div>
      </div>
    </div>
  );
};

