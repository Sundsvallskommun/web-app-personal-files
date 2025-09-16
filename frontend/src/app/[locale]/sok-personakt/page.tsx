'use client';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { SearchPersonalFiles } from '@components/search-personal-files/search-personal-files.components';
import { SearchPersonalFileIcon } from '@components/app-icon/search-personal-file-icon.component';

export const SokPersonakt: React.FC = () => {
  return (
    <DefaultLayout>
      <Main>
        <div className="flex flex-col justify-center items-center py-24 gap-24">
          <SearchPersonalFileIcon />
          <h1 className="text-center">Sök personakt</h1>
          <SearchPersonalFiles />
        </div>
      </Main>
    </DefaultLayout>
  );
};

export default SokPersonakt;
