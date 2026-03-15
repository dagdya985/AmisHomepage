/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useConfigStore } from '../(home)/stores/config-store';
import { toast, Toaster } from 'sonner';
import LoadingScreen from '../components/LoadingScreen';

interface ConfigState {
  config: any;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  privateKey: string;
}

interface MusicFile {
  id: string;
  name: string;
  path: string;
  order: number;
}

export default function ConfigPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { setSiteContent } = useConfigStore();
  const [state, setState] = useState<ConfigState>({
    config: null,
    loading: true,
    error: null,
    isSaving: false,
    saveSuccess: false,
    privateKey: ''
  });
  const [musicList, setMusicList] = useState<MusicFile[]>([]);

  useEffect(() => {
    fetchConfig();
    loadPrivateKey();
    fetchMusicList();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.config) {
        setState(prev => ({
          ...prev,
          config: data.config,
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: t('loadConfigFailed')
      }));
    }
  };

  const loadPrivateKey = () => {
    const saved = localStorage.getItem('github_private_key');
    if (saved) {
      setState(prev => ({ ...prev, privateKey: saved }));
    }
  };

  const fetchMusicList = async () => {
    try {
      const response = await fetch('/api/music');
      const data = await response.json();
      if (data.success && data.music) {
        setMusicList(data.music);
      }
    } catch (error) {
      console.error('Failed to fetch music list:', error);
    }
  };

  const moveMusic = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= musicList.length) return;
    
    const newList = [...musicList];
    const [movedItem] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, movedItem);
    
    setMusicList(newList);
    
    const order: Record<string, number> = {};
    newList.forEach((music, index) => {
      const filename = music.path.replace('/music/', '');
      order[filename] = index;
    });
    
    try {
      const response = await fetch('/api/music/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order,
          privateKey: state.privateKey
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Failed to update music order:', error);
      toast.error(t('configSaveFailed'));
      fetchMusicList();
    }
  };

  const deleteMusic = async (music: MusicFile) => {
    if (!confirm(`确定要删除 "${music.name}" 吗？`)) return;
    
    const filename = music.path.replace('/music/', '');
    
    try {
      const response = await fetch(`/api/music?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'X-Private-Key': state.privateKey
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除失败');
      }
      
      toast.success(t('fileUploadSuccess'));
      fetchMusicList();
    } catch (error) {
      console.error('Failed to delete music:', error);
      toast.error(t('fileUploadFailed'));
    }
  };

  const savePrivateKey = () => {
    localStorage.setItem('github_private_key', state.privateKey);
  };

  const handleFileUpload = async (file: File) => {
    if (!state.privateKey) {
      toast.error(t('uploadPemFirst'));
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('privateKey', state.privateKey);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      toast.success(t('fileUploadSuccess'));
      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('fileUploadFailed'));
      return null;
    }
  };

  const handleSaveConfig = async () => {
    if (!state.config) return;
    if (!state.privateKey) {
      toast.error(t('uploadPemFirst'));
      return;
    }

    setState(prev => ({ ...prev, isSaving: true, saveSuccess: false }));

    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          config: state.config,
          privateKey: state.privateKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '保存失败');
      }

      savePrivateKey();
      setSiteContent({
        showProjects: state.config.showProjects,
        showSkills: state.config.showSkills,
        showLocalTime: state.config.showLocalTime,
        showCustomCursor: state.config.showCustomCursor,
        customCursorPath: state.config.customCursorPath
      });
      setState(prev => ({ ...prev, isSaving: false, saveSuccess: true }));
      toast.success(t('configSaveSuccess'));
      setTimeout(() => {
        setState(prev => ({ ...prev, saveSuccess: false }));
      }, 3000);
    } catch (error) {
      console.error('Save error:', error);
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: t('configSaveFailed')
      }));
      toast.error(t('configSaveFailed'));
    }
  };

  const handleInputChange = (path: string, value: any) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return { ...prev, config: newConfig };
    });
  };

  const handlePemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setState(prev => ({ ...prev, privateKey: content }));
      };
      reader.readAsText(file);
    }
  };

  const addProject = () => {
    setState(prev => {
      const newConfig = { ...prev.config };
      if (!newConfig.projects.featured) {
        newConfig.projects.featured = [];
      }
      const newProject = {
        id: `project-${Date.now()}`,
        name: '新项目',
        description: { zh: '项目描述', en: 'Project description' },
        url: '',
        image: '',
        tags: [],
        icon: 'fas fa-project',
        gradient: 'from-blue-500 to-purple-600'
      };
      newConfig.projects.featured.push(newProject);
      return { ...prev, config: newConfig };
    });
  };

  const removeProject = (index: number) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      newConfig.projects.featured.splice(index, 1);
      return { ...prev, config: newConfig };
    });
  };

  const addSkill = () => {
    setState(prev => {
      const newConfig = { ...prev.config };
      if (!newConfig.skills) {
        newConfig.skills = [];
      }
      const newSkill = {
        name: '新技能',
        level: 50,
        color: 'from-blue-500 to-purple-600',
        icon: 'fas fa-star'
      };
      newConfig.skills.push(newSkill);
      return { ...prev, config: newConfig };
    });
  };

  const removeSkill = (index: number) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      newConfig.skills.splice(index, 1);
      return { ...prev, config: newConfig };
    });
  };

  const colors = {
    background: theme === 'dark' ? 'bg-gradient-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    card: theme === 'dark' ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white/80 backdrop-blur-md border border-gray-200',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    input: theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    button: theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    buttonDelete: theme === 'dark' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600',
    checkbox: theme === 'dark' ? 'border-white/20' : 'border-gray-300'
  };

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{state.error}</p>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null, loading: true }))}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <Toaster position="top-center" richColors />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="/"
              className={`px-4 py-2 rounded-xl border ${colors.card} ${colors.text} hover:bg-blue-500/10 transition-all flex items-center gap-2`}
            >
              <i className="fas fa-arrow-left"></i>
              {t('backToHome')}
            </a>
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="fas fa-cog text-white text-xl"></i>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {t('configManagement')}
              </h1>
            </div>
          </div>
          <p className={`${colors.textSecondary} text-lg max-w-2xl mx-auto`}>
            {t('configDescription')}
          </p>
        </header>
        
        <div className="space-y-8">
          {state.config ? (
            <>
              {/* GitHub 认证 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <i className="fab fa-github text-white"></i>
                  </div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>{t('githubAuth')}</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>
                      {t('pemKeyFile')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pem"
                        onChange={handlePemUpload}
                        className={`w-full px-4 py-3 rounded-xl border ${colors.input} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:cursor-pointer`}
                      />
                    </div>
                    <p className={`text-xs mt-2 ${colors.textSecondary}`}>
                      {t('pemKeyHint')}
                    </p>
                  </div>
                  {state.privateKey && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-3 bg-green-500/10 rounded-xl">
                      <i className="fas fa-check-circle"></i>
                      <span>{t('pemKeyLoaded')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 网站组件 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <i className="fas fa-puzzle-piece text-white"></i>
                  </div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>{t('siteComponents')}</h3>
                </div>
                
                <div className="space-y-6">
                  {/* 时间组件 */}
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <i className="fas fa-clock text-white text-sm"></i>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium ${colors.text}`}>{t('localTimeComponent')}</label>
                          <p className={`text-xs mt-0.5 ${colors.textSecondary}`}>{t('enableLocalTime')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInputChange('showLocalTime', !state.config.showLocalTime)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                          state.config.showLocalTime 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                            : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                            state.config.showLocalTime ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* 鼠标指针组件 */}
                  <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <i className="fas fa-mouse-pointer text-white text-sm"></i>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium ${colors.text}`}>{t('cursorSettings')}</label>
                          <p className={`text-xs mt-0.5 ${colors.textSecondary}`}>{t('cursorFileHint')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInputChange('showCustomCursor', !state.config.showCustomCursor)}
                        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                          state.config.showCustomCursor 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                            : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                            state.config.showCustomCursor ? 'left-8' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {state.config.showCustomCursor && (
                      <div className="space-y-3 pt-3 border-t border-white/10">
                        <div>
                          <label className={`block text-xs font-medium mb-2 ${colors.textSecondary}`}>
                            {t('cursorFile')}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={state.config.customCursorPath || '/cursors/watermelon.cur'}
                              onChange={(e) => handleInputChange('customCursorPath', e.target.value)}
                              className={`flex-1 px-3 py-2 rounded-lg border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                            />
                            <input
                              type="file"
                              accept=".cur"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                if (!file.name.toLowerCase().endsWith('.cur')) {
                                  toast.error(t('cursorFileError'));
                                  return;
                                }
                                
                                if (!state.privateKey) {
                                  toast.error(t('uploadPemFirst'));
                                  return;
                                }
                                
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  formData.append('privateKey', state.privateKey);
                                  formData.append('targetDir', 'cursors');

                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  });

                                  const data = await response.json();

                                  if (!response.ok) {
                                    throw new Error(data.error || '上传失败');
                                  }

                                  handleInputChange('customCursorPath', data.path);
                                  toast.success(t('cursorUploadSuccess'));
                                } catch (error) {
                                  console.error('Cursor upload error:', error);
                                  toast.error(t('cursorUploadError'));
                                }
                              }}
                              className={`px-3 py-2 rounded-lg border ${colors.input} file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white file:cursor-pointer text-sm`}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-10 h-10 rounded-lg border ${colors.card} flex items-center justify-center`}
                            style={{ cursor: `url('${state.config.customCursorPath || '/cursors/watermelon.cur'}'), auto` }}
                          >
                            <i className={`fas fa-mouse-pointer ${colors.textSecondary}`}></i>
                          </div>
                          <span className={`text-xs ${colors.textSecondary} flex-1`}>
                            {t('cursorPreviewHint')}
                          </span>
                          <button
                            onClick={() => handleInputChange('customCursorPath', '/cursors/watermelon.cur')}
                            className={`px-3 py-1.5 rounded-lg border ${colors.card} ${colors.text} hover:bg-red-500/10 hover:border-red-500/30 transition-all text-xs`}
                          >
                            <i className="fas fa-undo mr-1"></i>
                            {t('resetCursor')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 网站信息 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <i className="fas fa-globe text-white"></i>
                  </div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>{t('siteInfo')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteName')}</label>
                    <input
                      type="text"
                      value={state.config.site?.name || ''}
                      onChange={(e) => handleInputChange('site.name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteTitleLabel')}</label>
                    <input
                      type="text"
                      value={state.config.site?.title || ''}
                      onChange={(e) => handleInputChange('site.title', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteUrl')}</label>
                    <input
                      type="text"
                      value={state.config.site?.url || ''}
                      onChange={(e) => handleInputChange('site.url', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                </div>
              </div>
              
              {/* 个人资料 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>{t('profile')}</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('name')}</label>
                      <input
                        type="text"
                        value={state.config.profile?.name || ''}
                        onChange={(e) => handleInputChange('profile.name', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('avatar')}</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={state.config.profile?.avatar || ''}
                          onChange={(e) => handleInputChange('profile.avatar', e.target.value)}
                          className={`flex-1 px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const path = await handleFileUpload(file);
                              if (path) {
                                handleInputChange('profile.avatar', path);
                              }
                            }
                          }}
                          className={`px-4 py-3 rounded-xl border ${colors.input} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:cursor-pointer`}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('bioChinese')}</label>
                    <textarea
                      value={state.config.profile?.currentFocus?.[0]?.text?.zh || ''}
                      onChange={(e) => handleInputChange('profile.currentFocus.0.text.zh', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('bioEnglish')}</label>
                    <textarea
                      value={state.config.profile?.currentFocus?.[0]?.text?.en || ''}
                      onChange={(e) => handleInputChange('profile.currentFocus.0.text.en', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                </div>
              </div>

              {/* 背景大标题配置 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <i className="fas fa-heading text-white"></i>
                  </div>
                  <h3 className={`text-xl font-semibold ${colors.text}`}>{t('bgTitle')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('titleChinese')}</label>
                    <input
                      type="text"
                      value={state.config.translations?.zh?.siteTitle || ''}
                      onChange={(e) => handleInputChange('translations.zh.siteTitle', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('titleEnglish')}</label>
                    <input
                      type="text"
                      value={state.config.translations?.en?.siteTitle || ''}
                      onChange={(e) => handleInputChange('translations.en.siteTitle', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    />
                  </div>
                </div>
              </div>

              {/* 项目配置 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <i className="fas fa-folder-open text-white"></i>
                    </div>
                    <h3 className={`text-xl font-semibold ${colors.text}`}>{t('featuredProjects')}</h3>
                  </div>
                  <button
                    onClick={addProject}
                    className={`px-4 py-2 rounded-xl ${colors.button} text-white transition-all`}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {t('addProject')}
                  </button>
                </div>
                <div className="space-y-4">
                  {state.config.projects?.featured?.map((project: any, index: number) => (
                    <div key={project.id} className={`p-4 rounded-xl border ${colors.card}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`font-medium ${colors.text}`}>{project.name}</span>
                        <button
                          onClick={() => removeProject(index)}
                          className={`px-3 py-1 rounded-lg ${colors.buttonDelete} transition-all`}
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          {t('delete')}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('name')}</label>
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const newProjects = [...state.config.projects.featured];
                              newProjects[index].name = e.target.value;
                              handleInputChange('projects.featured', newProjects);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>URL</label>
                          <input
                            type="text"
                            value={project.url}
                            onChange={(e) => {
                              const newProjects = [...state.config.projects.featured];
                              newProjects[index].url = e.target.value;
                              handleInputChange('projects.featured', newProjects);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('description')} ({t('chinese')})</label>
                          <input
                            type="text"
                            value={project.description?.zh || ''}
                            onChange={(e) => {
                              const newProjects = [...state.config.projects.featured];
                              newProjects[index].description.zh = e.target.value;
                              handleInputChange('projects.featured', newProjects);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('description')} ({t('english')})</label>
                          <input
                            type="text"
                            value={project.description?.en || ''}
                            onChange={(e) => {
                              const newProjects = [...state.config.projects.featured];
                              newProjects[index].description.en = e.target.value;
                              handleInputChange('projects.featured', newProjects);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 技能配置 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <i className="fas fa-chart-line text-white"></i>
                    </div>
                    <h3 className={`text-xl font-semibold ${colors.text}`}>{t('skills')}</h3>
                  </div>
                  <button
                    onClick={addSkill}
                    className={`px-4 py-2 rounded-xl ${colors.button} text-white transition-all`}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    {t('addSkill')}
                  </button>
                </div>
                <div className="space-y-4">
                  {state.config.skills?.map((skill: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border ${colors.card}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`font-medium ${colors.text}`}>{skill.name}</span>
                        <button
                          onClick={() => removeSkill(index)}
                          className={`px-3 py-1 rounded-lg ${colors.buttonDelete} transition-all`}
                        >
                          <i className="fas fa-trash-alt mr-1"></i>
                          {t('delete')}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('name')}</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...state.config.skills];
                              newSkills[index].name = e.target.value;
                              handleInputChange('skills', newSkills);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('level')} (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...state.config.skills];
                              newSkills[index].level = parseInt(e.target.value) || 0;
                              handleInputChange('skills', newSkills);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('icon')}</label>
                          <input
                            type="text"
                            value={skill.icon}
                            onChange={(e) => {
                              const newSkills = [...state.config.skills];
                              newSkills[index].icon = e.target.value;
                              handleInputChange('skills', newSkills);
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                            placeholder="fas fa-star"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 音乐管理 */}
              <div className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                      <i className="fas fa-music text-white"></i>
                    </div>
                    <h3 className={`text-xl font-semibold ${colors.text}`}>{t('playlist')}</h3>
                  </div>
                  <button
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.mp3,.wav,.ogg,.m4a,.flac';
                      input.onchange = async (e: any) => {
                        const file = e.target?.files?.[0];
                        if (file) {
                          if (!state.privateKey) {
                            toast.error(t('uploadPemFirst'));
                            return;
                          }
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('privateKey', state.privateKey);
                            formData.append('targetDir', 'music');

                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData
                            });

                            const data = await response.json();

                            if (!response.ok) {
                              throw new Error(data.error || '上传失败');
                            }

                            toast.success(t('fileUploadSuccess'));
                            fetchMusicList();
                          } catch (error) {
                            console.error('Upload error:', error);
                            toast.error(t('fileUploadFailed'));
                          }
                        }
                      };
                      input.click();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all"
                  >
                    <i className="fas fa-upload mr-2"></i>
                    {t('uploadMusic')}
                  </button>
                </div>
                <p className={`text-sm mb-4 ${colors.textSecondary}`}>
                  {t('musicUploadHint')}
                </p>
                <div className="space-y-2">
                  {musicList.length === 0 ? (
                    <div className={`text-center py-8 rounded-xl border ${colors.card}`}>
                      <i className={`fas fa-music text-4xl mb-3 ${colors.textSecondary}`}></i>
                      <p className={colors.textSecondary}>{t('noMusic')}</p>
                    </div>
                  ) : (
                    musicList.map((music: any, index: number) => (
                      <div
                        key={music.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${colors.card} group`}
                      >
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveMusic(index, index - 1)}
                            disabled={index === 0}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                            } ${colors.textSecondary}`}
                          >
                            <i className="fas fa-chevron-up text-xs"></i>
                          </button>
                          <button
                            onClick={() => moveMusic(index, index + 1)}
                            disabled={index === musicList.length - 1}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              index === musicList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'
                            } ${colors.textSecondary}`}
                          >
                            <i className="fas fa-chevron-down text-xs"></i>
                          </button>
                        </div>
                        <span className={`w-6 text-center text-sm ${colors.textSecondary}`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-music text-pink-500"></i>
                          </div>
                          <span className={`truncate ${colors.text}`}>{music.name}</span>
                        </div>
                        <button
                          onClick={() => deleteMusic(music)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${colors.buttonDelete}`}
                        >
                          <i className="fas fa-trash-alt text-sm"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* 保存按钮 */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleSaveConfig}
                  disabled={state.isSaving}
                  className={`px-8 py-4 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${colors.button} shadow-lg hover:shadow-xl`}
                >
                  {state.isSaving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      {t('saving')}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      {t('saveToGithub')}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className={`text-2xl font-semibold mb-4 ${colors.text}`}>
                {t('loading')}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
