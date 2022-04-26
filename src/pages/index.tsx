import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Card = {
  id: string;
  ts: number;
  title: string;
  description: string;
  url: string;
};

type fetchImagesType = {
  data: Card[];
  after: string | null;
};

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = 0 }): Promise<fetchImagesType> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    let formattedPagesData: Card[] = [];
    data?.pages.map(page => {
      formattedPagesData = [...formattedPagesData, ...page.data];
      // eslint-disable-next-line no-useless-return
      return;
    });
    return formattedPagesData;
  }, [data]);

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button mt="1rem" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
