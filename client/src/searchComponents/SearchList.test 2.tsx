import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchList from './SearchList.tsx';
import { res_searchList } from '../Tests/MockSearchList.ts';



describe('SearchList Component', () => {
    test('renders search result with a list of artists', async () => {
        const MockSearchList = res_searchList

        render(<SearchList
            searchResult={MockSearchList} />)

        const trackItems = await screen.findAllByRole('listitem');
        expect(trackItems).toHaveLength(20);

    })
})