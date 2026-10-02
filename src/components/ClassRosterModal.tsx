import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  Shield,
  Star,
  Settings,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import { Student, ClassMetadata } from '../types/discipline';
import { downloadSampleExcelTemplate, exportCurrentStudentsToExcel } from '../utils/excelImport';

interface ClassRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  metadata: ClassMetadata;
  onUpdateMetadata: (meta: ClassMetadata) => void;
  onAddStudent: (student: Omit<Student, 'id' | 'stt'>) => void;
  onUpdateStudent: (id: string, updated: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onResetData: () => void;
  onOpenImportModal: () => void;
}

export const ClassRosterModal: React.FC<ClassRosterModalProps> = ({
  isOpen,
  onClose,
  students,
  metadata,
  onUpdateMetadata,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onResetData,
  onOpenImportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'classInfo'>('students');
  const [selectedGroup, setSelectedGroup] = useState<number>(1);
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // Form thêm học sinh mới
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newRole, setNewRole] = useState('Học sinh');

  // Metadata form
  const [schoolName, setSchoolName] = useState(metadata.schoolName || 'Trường THCS Lê Quý Đôn');
  const [className, setClassName] = useState(metadata.className);
  const [semester, setSemester] = useState<1 | 2>(metadata.semester || 1);
  const [homeroomTeacher, setHomeroomTeacher] = useState(metadata.homeroomTeacher);
  const [academicYear, setAcademicYear] = useState(metadata.academicYear);
  const [monitorName, setMonitorName] = useState(metadata.monitorName);
  const [academicViceMonitorName, setAcademicViceMonitorName] = useState(metadata.academicViceMonitorName || 'Nguyễn Thảo Linh');
  const [laborViceMonitorName, setLaborViceMonitorName] = useState(metadata.laborViceMonitorName || 'Bùi Quang Khải');
  const [disciplineViceMonitorName, setDisciplineViceMonitorName] = useState(metadata.disciplineViceMonitorName || metadata.viceMonitorName || 'Lê Hoàng Yến Nhi');
  const [metadataSaved, setMetadataSaved] = useState(false);
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  if (!isOpen) return null;

  const groupStudents = students.filter((s) => s.groupId === selectedGroup);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddStudent({
      name: newName.trim(),
      gender: newGender,
      groupId: selectedGroup,
      role: newRole.trim() || undefined,
    });

    setNewName('');
    setIsAddingStudent(false);
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMetadata({
      schoolName: schoolName.trim(),
      className,
      grade: metadata.grade,
      semester,
      homeroomTeacher,
      academicYear,
      monitorName,
      academicViceMonitorName,
      laborViceMonitorName,
      disciplineViceMonitorName,
      viceMonitorName: disciplineViceMonitorName,
    });
    setMetadataSaved(true);
    setTimeout(() => setMetadataSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Quản Lý Danh Sách 6 Nhóm & Cấu Hình Lớp
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lớp {metadata.className} · Sĩ số: {students.length} học sinh
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'students'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Danh sách thành viên 6 Nhóm ({students.length} HS)
          </button>
          <button
            onClick={() => setActiveTab('classInfo')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'classInfo'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Thông tin lớp & GVCN
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'students' ? (
            <>
              {/* Thanh công cụ Excel: File mẫu, Chèn file, Xuất Excel */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    Nhập & Phân Chia Danh Sách Học Sinh Bằng File Excel
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Tải file mẫu có sẵn cấu trúc chuẩn THCS, sau đó nạp file để hệ thống tự động chia 6 nhóm
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={downloadSampleExcelTemplate}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 rounded-lg shadow-xs transition-colors"
                    title="Tải file Excel mẫu (.xlsx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>File Excel mẫu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onOpenImportModal();
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Nhập danh sách học sinh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportCurrentStudentsToExcel(students, metadata.className)}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-100 bg-white border border-emerald-300 rounded-lg transition-colors"
                    title="Xuất danh sách hiện tại ra Excel"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chọn Nhóm 1 -> 6 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGroup(g)}
                      className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                        selectedGroup === g
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Nhóm {g} ({students.filter((s) => s.groupId === g).length})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddingStudent(!isAddingStudent)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm vào Nhóm {selectedGroup}</span>
                </button>
              </div>

              {/* Form thêm học sinh mới */}
              {isAddingStudent && (
                <form
                  onSubmit={handleAddSubmit}
                  className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3"
                >
                  <h4 className="text-xs font-bold text-indigo-950">
                    Thêm học sinh mới vào Nhóm {selectedGroup}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="VD: Nguyễn Văn Hoàng"
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        Giới tính
                      </label>
                      <select
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value as 'Nam' | 'Nữ')}
                        className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Vai trò / Nhiệm vụ
                    </label>
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="VD: Nhóm trưởng, Cờ đỏ, Thành viên..."
                      className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStudent(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                    >
                      Lưu học sinh
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách học sinh trong nhóm đang chọn */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-3 w-12">STT</th>
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Vai trò</th>
                      <th className="py-2.5 px-3">Chuyển nhóm</th>
                      <th className="py-2.5 px-3 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupStudents.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {s.name}
                          {s.isLeader && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                              Tổ trưởng
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{s.gender}</td>
                        <td className="py-2.5 px-3">
                          <input
                            type="text"
                            defaultValue={s.role || ''}
                            onBlur={(e) => onUpdateStudent(s.id, { role: e.target.value })}
                            className="text-xs p-1 border border-slate-200 rounded w-28 bg-transparent hover:bg-white"
                          />
                        </td>
                        <td className="py-2.5 px-3">
                          <select
                            value={s.groupId}
                            onChange={(e) =>
                              onUpdateStudent(s.id, { groupId: Number(e.target.value) })
                            }
                            className="text-xs p-1 border border-slate-200 rounded bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6].map((g) => (
                              <option key={g} value={g}>
                                Nhóm {g}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {confirmDeleteStudentId === s.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  onDeleteStudent(s.id);
                                  setConfirmDeleteStudentId(null);
                                }}
                                className="px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded cursor-pointer"
                              >
                                Xóa
                              </button>
                              <button
                                onClick={() => setConfirmDeleteStudentId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteStudentId(s.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                              title="Xóa học sinh"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Tab Cấu hình thông tin lớp */
            <form onSubmit={handleSaveMetadata} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên trường THCS</label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="VD: Trường THCS Lê Quý Đôn"
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tên lớp</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Năm học</label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Học kỳ</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white cursor-pointer"
                  >
                    <option value={1}>Học kỳ I</option>
                    <option value={2}>Học kỳ II</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Giáo viên chủ nhiệm (GVCN)
                </label>
                <input
                  type="text"
                  required
                  value={homeroomTeacher}
                  onChange={(e) => setHomeroomTeacher(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-indigo-900 block mb-1">🎖️ Lớp trưởng</label>
                  <input
                    type="text"
                    value={monitorName}
                    onChange={(e) => setMonitorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-900 block mb-1">
                    📚 Lớp phó Học tập
                  </label>
                  <input
                    type="text"
                    value={academicViceMonitorName}
                    onChange={(e) => setAcademicViceMonitorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    🧹 Lớp phó Lao động
                  </label>
                  <input
                    type="text"
                    value={laborViceMonitorName}
                    onChange={(e) => setLaborViceMonitorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1">
                    🛡️ Lớp phó Trật tự
                  </label>
                  <input
                    type="text"
                    value={disciplineViceMonitorName}
                    onChange={(e) => setDisciplineViceMonitorName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                {confirmResetOpen ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-bold">Xác nhận khôi phục?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onResetData();
                        setConfirmResetOpen(false);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded cursor-pointer"
                    >
                      Đồng ý
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetOpen(false)}
                      className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs rounded cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Khôi phục dữ liệu mẫu ban đầu</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  {metadataSaved && (
                    <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
                      ✓ Đã lưu cài đặt!
                    </span>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Lưu Thông Tin Lớp
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
