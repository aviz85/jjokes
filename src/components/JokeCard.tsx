import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

type Joke = Database['public']['Tables']['jokes']['Row'];

interface Props {
  joke: Joke;
  onPress: (joke: Joke) => void;
}

export default function JokeCard({ joke, onPress }: Props) {
  const [rating, setRating] = useState(joke.rating);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRating = async (value: number) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      const newRating = rating + value;
      const { error } = await supabase
        .from('jokes')
        .update({ rating: newRating })
        .eq('id', joke.id);

      if (error) throw error;
      
      setRating(newRating);
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress({ ...joke, rating })}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{joke.original}</Text>
        <View style={styles.footer}>
          <Text style={styles.tags}>{joke.tags}</Text>
          <View style={styles.ratingContainer}>
            <TouchableOpacity 
              onPress={() => handleRating(1)}
              style={[styles.ratingButton, isUpdating && styles.disabled]}
              disabled={isUpdating}
            >
              <MaterialCommunityIcons 
                name="thumb-up" 
                size={20} 
                color={isUpdating ? '#ccc' : '#4c669f'} 
              />
            </TouchableOpacity>
            <Text style={styles.rating}>{rating}</Text>
            <TouchableOpacity 
              onPress={() => handleRating(-1)}
              style={[styles.ratingButton, isUpdating && styles.disabled]}
              disabled={isUpdating}
            >
              <MaterialCommunityIcons 
                name="thumb-down" 
                size={20} 
                color={isUpdating ? '#ccc' : '#666'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingButton: {
    padding: 5,
  },
  rating: {
    color: '#4c669f',
    fontWeight: '600',
    marginHorizontal: 8,
  },
  tags: {
    color: '#666',
    fontSize: 12,
  },
  disabled: {
    opacity: 0.5,
  },
}); 