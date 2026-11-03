import React, { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { SKILL_TAXONOMY, CATEGORIES_LIST, SkillCategory } from '../data/skillTaxonomy';

interface SkillTagInputProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  maxSkills?: number;
  label?: string;
  helperText?: string;
  showCategoryPicker?: boolean;
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({
  selectedSkills,
  onChange,
  placeholder = 'Type a skill (e.g. React, FastAPI, Docker) and press Enter...',
  maxSkills = 20,
  label,
  helperText,
  showCategoryPicker = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'All'>('All');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = SKILL_TAXONOMY.filter((item) => {
    const isAlreadySelected = selectedSkills.some(
      (s) => s.toLowerCase() === item.name.toLowerCase()
    );
    if (isAlreadySelected) return false;

    const matchesCategory =
      activeCategory === 'All' || item.category === activeCategory;

    if (!inputValue.trim()) {
      return matchesCategory;
    }

    const searchLower = inputValue.toLowerCase().trim();
    const matchesName = item.name.toLowerCase().includes(searchLower);
    const matchesAlias = item.aliases?.some((a) =>
      a.toLowerCase().includes(searchLower)
    );

    return (matchesName || matchesAlias) && matchesCategory;
  }).slice(0, 10);

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    const exists = selectedSkills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists && selectedSkills.length < maxSkills) {
      onChange([...selectedSkills, trimmed]);
    }

    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (filteredSuggestions.length > 0 && inputValue.trim()) {
        addSkill(filteredSuggestions[0].name);
      } else if (inputValue.trim()) {
        addSkill(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedSkills.length > 0) {
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold text-[#1A1A1A]">
          <span>{label}</span>
          <span className="text-[#6B7280] font-normal">
            {selectedSkills.length}/{maxSkills} tags
          </span>
        </div>
      )}

      {/* Selected tags container with inline input */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="min-h-[46px] p-2 bg-white border border-[#E5E7EB] rounded-xl flex flex-wrap items-center gap-1.5 focus-within:border-black transition-all cursor-text shadow-xs"
      >
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFFDF5] text-[#1A1A1A] text-xs font-semibold border border-[#FFD600] group transition-colors"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="text-gray-400 hover:text-black transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedSkills.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[140px] border-none bg-transparent text-xs text-[#1A1A1A] focus:outline-none placeholder:text-[#6B7280] py-1"
        />
      </div>

      {helperText && (
        <p className="text-[11px] text-[#6B7280]">{helperText}</p>
      )}

      {/* Autocomplete / taxonomy browser dropdown */}
      {isDropdownOpen && (
        <div className="relative z-30">
          <div className="absolute top-1 left-0 right-0 bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-3 space-y-3 animate-in fade-in-50 duration-150">
            {/* Category tabs */}
            {showCategoryPicker && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    activeCategory === 'All'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#1A1A1A] text-white'
                        : 'text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Suggestions list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-1">
                {inputValue ? 'Matching Skills in Taxonomy' : `Popular in ${activeCategory}`}
              </div>

              {filteredSuggestions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 p-1">
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => addSkill(item.name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-[#1A1A1A] bg-gray-50 hover:bg-[#FFD600] border border-[#E5E7EB] rounded-lg transition-colors"
                    >
                      <Plus className="w-3 h-3 text-gray-400 group-hover:text-black" />
                      <span>{item.name}</span>
                      <span className="text-[10px] text-[#6B7280]">· {item.category}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-[#6B7280]">
                  {inputValue ? (
                    <div>
                      <span>No taxonomy match for "{inputValue}". </span>
                      <button
                        type="button"
                        onClick={() => addSkill(inputValue)}
                        className="text-[#1A1A1A] font-bold underline hover:opacity-80 ml-1"
                      >
                        Add custom skill "{inputValue}"
                      </button>
                    </div>
                  ) : (
                    <span>All skills in this category are selected.</span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>Press <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-[#E5E7EB]">Enter</kbd> to add</span>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(false)}
                className="text-[#1A1A1A] hover:underline font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTagInput;

