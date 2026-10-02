import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  UserCheck,
  Flame,
  ShieldAlert,
  FileSpreadsheet,
} from 'lucide-react';
import { GroupSummary, Student, StudentWeeklyRecord } from '../types/discipline';
import { getClassificationColor } from '../utils/scoring';

interface GroupCompetitionViewProps {
  groups: GroupSummary[];
  currentWeekName: string;
  onSelectStudent: (student: Student) => void;
  onQuickRecordStudent: (student: Student) => void;
  onOpenImportRoster?: () => void;
}

export const GroupCompetitionView: React.FC<GroupCompetitionViewProps> = ({
  groups,
  currentWeekName,
  onSelectStudent,
  onQuickRecordStudent,
  onOpenImportRoster,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(groups[0]?.groupId || 1);

  // Nhóm có rank = 1, 2, 3
  const top1 = groups.find((g) => g.rank === 1);
  const top2 = groups.find((g) => g.rank === 2);
  const top3 = groups.find((g) => g.rank === 3);

  // Nhóm được chọn để xem chi tiết
  const activeGroup = groups.find((g) => g.groupId === selectedGroupId) || groups[0];

  // Tính các danh hiệu thi đua đặc biệt
  const bestDisciplineGroup = [...groups].sort((a, b) => a.totalPenalty - b.totalPenalty)[0];
  const mostActiveGroup = [...groups].sort((a, b) => b.totalBonus - a.totalBonus)[0];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          title: 'HẠNG NHẤT · CỜ ĐỎ THI ĐUA',
          bg: 'bg-amber-500 text-white shadow-amber-200 shadow-md',
          border: 'border-amber-400',
          textColor: 'text-amber-600',
          icon: Trophy,
        };
      case 2:
        return {
          title: 'HẠNG NHÌ · CỜ VÀNG',
          bg: 'bg-slate-400 text-white',
          border: 'border-slate-300',
          textColor: 'text-slate-600',
          icon: Medal,
        };
      case 3:
        return {
          title: 'HẠNG BA · CỜ XANH',
          bg: 'bg-amber-700 text-white',
          border: 'border-amber-600',
          textColor: 'text-amber-800',
          icon: Award,
        };
      default:
        return {
          title: `HẠNG ${rank}`,
          bg: 'bg-slate-200 text-slate-700',
          border: 'border-slate-200',
          textColor: 'text-slate-500',
          icon: Award,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Kết quả thi đua tuần */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Bảng Xếp Hạng Thi Đua 6 Nhóm</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Kết Quả Thi Đua Nề Nếp · {currentWeekName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Xếp hạng dựa trên Điểm trung bình nề nếp (Điểm chuẩn 100 - Điểm vi phạm + Điểm cộng)
            </p>
          </div>

          {/* Quick stats highlights */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-emerald-700">Hăng hái nhất</p>
                <p className="text-xs font-bold text-slate-900">{mostActiveGroup?.groupName} (+{mostActiveGroup?.totalBonus}đ)</p>
              </div>
            </div>

            <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-blue-700">Nề nếp tốt nhất</p>
                <p className="text-xs font-bold text-slate-900">{bestDisciplineGroup?.groupName} (-{bestDisciplineGroup?.totalPenalty}đ)</p>
              </div>
            </div>

            {onOpenImportRoster && (
              <button
                onClick={onOpenImportRoster}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                title="Nhập danh sách học sinh từ file Excel & Phân chia 6 nhóm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Nhập danh sách học sinh</span>
              </button>
            )}
          </div>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Top 2 */}
          {top2 && (
            <div
              onClick={() => setSelectedGroupId(top2.groupId)}
              className={`cursor-pointer rounded-xl p-4 border transition-all ${
                selectedGroupId === top2.groupId
                  ? 'border-indigo-500 ring-2 ring-indigo-100 bg-slate-50/80'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Hạng 2 · Cờ Vàng
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{top2.groupName}</h3>
              <p className="text-xs text-slate-500 mb-3">Tổ trưởng: {top2.leaderName}</p>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Điểm TB thi đua</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {top2.averageScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          )}

          {/* Top 1 - Champion */}
          {top1 && (
            <div
              onClick={() => setSelectedGroupId(top1.groupId)}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative overflow-hidden ${
                selectedGroupId === top1.groupId
                  ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/40'
                  : 'border-amber-300 hover:border-amber-400 bg-amber-50/20'
              }`}
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-xs">
                <Trophy className="w-3 h-3" />
                <span>QUÁN QUÂN TUẦN</span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Hạng 1 · Cờ Luân Lưu
                </span>
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  1
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{top1.groupName}</h3>
              <p className="text-xs text-slate-600 mb-3">Tổ trưởng: {top1.leaderName}</p>

              <div className="flex items-baseline justify-between pt-2 border-t border-amber-200/60">
                <span className="text-xs font-medium text-amber-800">Điểm TB thi đua</span>
                <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums">
                  {top1.averageScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          )}

          {/* Top 3 */}
          {top3 && (
            <div
              onClick={() => setSelectedGroupId(top3.groupId)}
              className={`cursor-pointer rounded-xl p-4 border transition-all ${
                selectedGroupId === top3.groupId
                  ? 'border-indigo-500 ring-2 ring-indigo-100 bg-slate-50/80'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Hạng 3 · Cờ Đồng
                </span>
                <span className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{top3.groupName}</h3>
              <p className="text-xs text-slate-500 mb-3">Tổ trưởng: {top3.leaderName}</p>

              <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">Điểm TB thi đua</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
                  {top3.averageScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Bảng tổng hợp 6 nhóm (Left) + Chi tiết thành viên nhóm đang chọn (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột 1: Danh sách xếp hạng cả 6 nhóm */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Bảng Tổng Sắp 6 Nhóm ({groups.length} tổ)
            </h3>
            <span className="text-xs text-slate-500">Bấm để xem học sinh</span>
          </div>

          <div className="space-y-2">
            {groups.map((group) => {
              const badge = getRankBadge(group.rank);
              const isSelected = selectedGroupId === group.groupId;
              return (
                <div
                  key={group.groupId}
                  onClick={() => setSelectedGroupId(group.groupId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 shadow-xs ring-1 ring-indigo-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${badge.bg}`}
                    >
                      {group.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{group.groupName}</h4>
                        {group.rank <= 3 && (
                          <span className={`text-[10px] font-semibold ${badge.textColor}`}>
                            {group.rank === 1 ? '🥇 Nhất' : group.rank === 2 ? '🥈 Nhì' : '🥉 Ba'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {group.memberCount} học sinh · Tổ trưởng: {group.leaderName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-slate-900 tabular-nums">
                      {group.averageScore}
                      <span className="text-[10px] font-normal text-slate-400"> đ</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] justify-end">
                      <span className="text-rose-600 font-medium font-mono tabular-nums">
                        -{group.totalPenalty}đ
                      </span>
                      <span className="text-slate-300">/</span>
                      <span className="text-emerald-600 font-medium font-mono tabular-nums">
                        +{group.totalBonus}đ
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ghi chú thi đua */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              Quy chế thi đua tuần:
            </p>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              • Nhóm xếp Hạng 1 nhận cờ thi đua luân lưu trong tiết chào cờ đầu tuần.
              <br />
              • Nhóm có học sinh vi phạm nghiêm trọng (dùng điện thoại, vô lễ, bỏ tiết) bị hạ bậc thi đua.
            </p>
          </div>
        </div>

        {/* Cột 2: Chi tiết học sinh của Nhóm đang chọn */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            {/* Header chi tiết nhóm */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                    Hạng {activeGroup.rank}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{activeGroup.groupName}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổ trưởng: <span className="font-medium text-slate-700">{activeGroup.leaderName}</span> · Sĩ số: {activeGroup.memberCount} học sinh
                </p>
              </div>

              {/* Tỉ lệ xếp loại trong nhóm */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-medium">
                  {activeGroup.goodCount} Tốt
                </span>
                <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 font-medium">
                  {activeGroup.fairCount} Khá
                </span>
                {activeGroup.passCount > 0 && (
                  <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-medium">
                    {activeGroup.passCount} Đạt
                  </span>
                )}
                {activeGroup.failCount > 0 && (
                  <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 font-medium">
                    {activeGroup.failCount} Chưa đạt
                  </span>
                )}
              </div>
            </div>

            {/* Bảng danh sách thành viên trong nhóm */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-2.5 px-3 w-10">STT</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3">Vai trò</th>
                    <th className="py-2.5 px-2 text-center text-rose-600">Trừ</th>
                    <th className="py-2.5 px-2 text-center text-emerald-600">Cộng</th>
                    <th className="py-2.5 px-3 text-right">Tổng điểm</th>
                    <th className="py-2.5 px-3 text-center">Xếp loại</th>
                    <th className="py-2.5 px-2 text-center">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeGroup.students.map((calc, idx) => {
                    const clsColor = getClassificationColor(calc.classification);
                    return (
                      <tr key={calc.student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            onClick={() => onSelectStudent(calc.student)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-left transition-colors"
                          >
                            {calc.student.name}
                          </button>
                          {calc.record.note && (
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">
                              {calc.record.note}
                            </p>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {calc.student.role || 'Thành viên'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-medium text-rose-600 tabular-nums">
                          {calc.totalPenalty > 0 ? `-${calc.totalPenalty}` : '0'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-medium text-emerald-600 tabular-nums">
                          {calc.totalBonus > 0 ? `+${calc.totalBonus}` : '0'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums text-sm">
                          {calc.finalScore}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${clsColor.badge}`}
                          >
                            {calc.classification}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            onClick={() => onQuickRecordStudent(calc.student)}
                            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded transition-colors"
                          >
                            Ghi nhận
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tóm tắt chỉ số nhóm */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Điểm trung bình</span>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {activeGroup.averageScore}
                </span>
              </div>
              <div className="p-2.5 bg-rose-50/60 rounded-lg">
                <span className="text-[11px] text-rose-600 block">Tổng điểm trừ</span>
                <span className="text-base font-bold font-mono text-rose-700 tabular-nums">
                  -{activeGroup.totalPenalty}
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50/60 rounded-lg">
                <span className="text-[11px] text-emerald-600 block">Tổng điểm cộng</span>
                <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
                  +{activeGroup.totalBonus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
