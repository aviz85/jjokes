import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import JokeCard from '../components/JokeCard';
import { Database } from '../lib/database.types';

type Joke = Database['public']['Tables']['jokes']['Row'];

const PAGE_SIZE = 10;

export default function HomeScreen({ navigation }: any) {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchJokes = async (pageNumber: number) => {
    try {
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from('jokes')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        if (pageNumber === 0) {
          setJokes(data);
        } else {
          setJokes(prev => [...prev, ...data]);
        }
        setHasMore(count ? from + data.length < count : false);
      }
    } catch (error) {
      console.error('Error fetching jokes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes(0);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchJokes(page + 1);
    }
  };

  const handleJokePress = (joke: Joke) => {
    navigation.navigate('JokeDetail', { joke });
  };

  if (loading && page === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jokes}
        renderItem={({ item }) => (
          <JokeCard joke={item} onPress={handleJokePress} />
        )}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#4c669f" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 