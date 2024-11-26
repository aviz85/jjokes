import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import JokeCard from '../components/JokeCard';

type Joke = Database['public']['Tables']['jokes']['Row'];

// קומפוננטה חדשה עבור כרטיס בדיחה מחוקה
function DeletedJokeCard({ joke, onRestore }: { joke: Joke; onRestore: (jokeId: number) => void }) {
  return (
    <JokeCard
      joke={joke}
      onPress={() => {}} // אין ניווט לפרטים במחוקות
      customActions={
        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={() => onRestore(joke.id)}
        >
          <MaterialCommunityIcons name="restore" size={24} color="#4c669f" />
        </TouchableOpacity>
      }
      hideDefaultActions // מסתיר את כפתורי ברירת המחדל
    />
  );
}

export default function TrashScreen({ navigation }: any) {
  const [deletedJokes, setDeletedJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeletedJokes = async () => {
    console.log('TrashScreen: Fetching deleted jokes');
    try {
      const { data, error } = await supabase
        .from('jokes')
        .select('*')
        .eq('is_deleted', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('TrashScreen: Error fetching deleted jokes:', error);
        throw error;
      }
      
      console.log('TrashScreen: Fetched deleted jokes:', data?.length);
      if (data) setDeletedJokes(data);
    } catch (error) {
      console.error('TrashScreen: Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (jokeId: number) => {
    console.log('TrashScreen: Restoring joke:', jokeId);
    try {
      const { error } = await supabase
        .from('jokes')
        .update({ is_deleted: false })
        .eq('id', jokeId);

      if (error) throw error;
      
      setDeletedJokes(prev => prev.filter(joke => joke.id !== jokeId));
      Alert.alert('הצלחה', 'הבדיחה שוחזרה בהצלחה');
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו לשחזר את הבדיחה, נסה שוב מאוחר יותר');
    }
  };

  const handleRestoreAll = async () => {
    try {
      const { error } = await supabase
        .from('jokes')
        .update({ is_deleted: false })
        .eq('is_deleted', true);

      if (error) throw error;
      
      setDeletedJokes([]);
      Alert.alert('הצלחה', 'כל הבדיחות שוחזרו בהצלחה');
    } catch (error) {
      Alert.alert('שגיאה', 'לא הצלחנו לשחזר את הבדיחות, נסה שוב מאוחר יותר');
    }
  };

  useEffect(() => {
    fetchDeletedJokes();
  }, []);

  // רענון בכל כניסה למסך
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDeletedJokes();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {deletedJokes.length > 0 && (
        <TouchableOpacity 
          style={styles.restoreAllButton} 
          onPress={handleRestoreAll}
        >
          <Text style={styles.restoreAllText}>שחזר הכל</Text>
          <MaterialCommunityIcons name="restore" size={24} color="#4c669f" />
        </TouchableOpacity>
      )}
      <FlatList<Joke>
        data={deletedJokes}
        renderItem={({ item }: { item: Joke }) => (
          <DeletedJokeCard joke={item} onRestore={handleRestore} />
        )}
        keyExtractor={(item: Joke) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  restoreAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  restoreAllText: {
    marginRight: 10,
    color: '#4c669f',
    fontWeight: '600',
    fontSize: 16,
  },
  restoreButton: {
    padding: 5,
  },
}); 