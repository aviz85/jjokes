import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';

type Joke = Database['public']['Tables']['jokes']['Row'];

interface Props {
  joke: Joke;
  onPress: (joke: Joke) => void;
}

export default function JokeCard({ joke, onPress }: Props) {
  const handleRating = async (value: number) => {
    try {
      const newRating = joke.rating + value;
      const { error } = await supabase
        .from('jokes')
        .update({ rating: newRating })
        .eq('id', joke.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(joke)}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{joke.original}</Text>
        <View style={styles.footer}>
          <Text style={styles.tags}>{joke.tags}</Text>
          <View style={styles.ratingContainer}>
            <TouchableOpacity 
              onPress={() => handleRating(1)}
              style={styles.ratingButton}
            >
              <MaterialCommunityIcons name="thumb-up" size={20} color="#4c669f" />
            </TouchableOpacity>
            <Text style={styles.rating}>{joke.rating}</Text>
            <TouchableOpacity 
      <Text style={styles.title} numberOfLines={2}>{joke.original}</Text>
      <View style={styles.footer}>
        <Text style={styles.rating}>דירוג: {joke.rating}</Text>
        <Text style={styles.tags}>{joke.tags}</Text>
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
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rating: {
    color: '#666',
  },
  tags: {
    color: '#666',
    fontSize: 12,
  },
}); 