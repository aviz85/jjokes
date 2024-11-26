import { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import JokeCard from '../components/JokeCard';
import { Database } from '../lib/database.types';

type Joke = Database['public']['Tables']['jokes']['Row'];

const PAGE_SIZE = 20;

export default function HomeScreen({ navigation }: any) {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchJokes = async (pageNumber: number) => {
    try {
      setLoadingMore(true);
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from('jokes')
        .select('*', { count: 'exact' })
        .eq('is_deleted', false)
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
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchJokes(0);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused - refreshing data');
      setPage(0);
      fetchJokes(0);
    });

    return unsubscribe;
  }, [navigation]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setPage(prev => prev + 1);
      fetchJokes(page + 1);
    }
  };

  const handleJokePress = (joke: Joke) => {
    navigation.navigate('JokeDetail', { joke });
  };

  const handleDelete = (jokeId: number) => {
    console.log('HomeScreen: handleDelete called with jokeId:', jokeId);
    setJokes(prev => {
      console.log('HomeScreen: Removing joke from list');
      return prev.filter(joke => joke.id !== jokeId);
    });
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
        renderItem={({ item }) => {
          console.log('Rendering joke card:', item.id);
          return (
            <JokeCard 
              joke={item} 
              onPress={handleJokePress}
              onDelete={handleDelete}
            />
          );
        }}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loadMoreText}>טען עוד</Text>
              )}
            </TouchableOpacity>
          ) : null
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
  loadMoreButton: {
    backgroundColor: '#4c669f',
    padding: 12,
    borderRadius: 8,
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 