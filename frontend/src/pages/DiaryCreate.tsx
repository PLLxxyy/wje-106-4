import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiaryForm } from '../components/diary/DiaryForm';
import { getDiaryDetailPath } from '../constants/routes';
import { useDiaryStore } from '../stores/useDiaryStore';

export const DiaryCreate = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const entryId = params.get('id');
  const entry = useDiaryStore((state) => state.entries.find((item) => item.id === entryId));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-stone-500 dark:text-stone-400">{entryId ? '编辑餐次' : '记录饮食'}</p>
        <h1 className="text-3xl font-semibold text-stone-950 dark:text-stone-100">
          {entryId ? '调整这一餐' : '写下这一餐'}
        </h1>
      </div>
      <DiaryForm entry={entry} onSaved={(saved) => navigate(getDiaryDetailPath(saved.id))} />
    </div>
  );
};
