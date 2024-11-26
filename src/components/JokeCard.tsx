import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

type Joke = Database['public']['Tables']['jokes']['Row'];

interface Props {
  joke: Joke;
  onPress: (joke: Joke) => void;
  onDelete?: (jokeId: number) => void;
  customActions?: React.ReactNode;
  hideDefaultActions?: boolean;
}

export default function JokeCard({ 
  joke, 
  onPress, 
  onDelete, 
  customActions,
  hideDefaultActions = false 
}: Props) {
  const [localRating, setLocalRating] = useState(joke.rating);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRating = async (value: number) => {
    if (isUpdating) return;
    
    const previousRating = localRating;
    const newRating = localRating + value;
    
    // אופטימיסטי UI - עדכון מיידי
    setLocalRating(newRating);
    setIsUpdating(true);
    
    try {
      const { error, data } = await supabase
        .from('jokes')
        .update({ rating: newRating })
        .eq('id', joke.id)
        .select()
        .single();

      if (error) throw error;
      
      // וידוא שהדאטה מסונכרנת
      if (data.rating !== newRating) {
        setLocalRating(data.rating);
      }
    } catch (error) {
      // שחזור המצב הקודם במקרה של שגיאה
      setLocalRating(previousRating);
      Alert.alert('שגיאה', 'לא הצלחנו לעדכן את הדירוג, נסה שוב מאוחר יותר');
      console.error('Error updating rating:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    console.log('Delete button pressed for joke:', joke.id, 'Full joke:', joke);
    setShowDeleteModal(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => onPress({ ...joke, rating: localRating })}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>{joke.original}</Text>
          <View style={styles.footer}>
            <View style={styles.actionsContainer}>
              {customActions || // הצג פעולות מותאמות אם יש
                (!hideDefaultActions && ( // ארת הצג את הכפתורים הרגילים
                  <>
                    <TouchableOpacity 
                      onPress={handleDelete}
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons 
                        name="delete" 
                        size={20} 
                        color="#ff4444"
                      />
                    </TouchableOpacity>
                    <View style={styles.ratingContainer}>
                      <TouchableOpacity 
                        onPress={() => handleRating(1)}
                        style={styles.ratingButton}
                        disabled={isUpdating}
                      >
                        <MaterialCommunityIcons 
                          name="thumb-up" 
                          size={20} 
                          color="#4c669f"
                        />
                      </TouchableOpacity>
                      <Text style={styles.rating}>{localRating}</Text>
                      <TouchableOpacity 
                        onPress={() => handleRating(-1)}
                        style={styles.ratingButton}
                        disabled={isUpdating}
                      >
                        <MaterialCommunityIcons 
                          name="thumb-down" 
                          size={20} 
                          color="#666"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
            </View>
            <Text style={styles.tags}>{joke.tags}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>מחיקת בדיחה</Text>
            <Text style={styles.modalText}>האם אתה בטוח שברצונך למחוק בדיחה זו?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonText}>ביטול</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonDelete]}
                onPress={async () => {
                  setShowDeleteModal(false);
                  // קוד המחיקה הקיים
                  try {
                    const { error } = await supabase
                      .from('jokes')
                      .update({ is_deleted: true })
                      .eq('id', joke.id);

                    if (error) throw error;
                    if (onDelete) onDelete(joke.id);
                  } catch (error) {
                    console.error('Error in delete process:', error);
                  }
                }}
              >
                <Text style={[styles.buttonText, styles.deleteText]}>מחק</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 5,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#f0f0f0',
  },
  buttonDelete: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    fontSize: 16,
  },
  deleteText: {
    color: 'white',
  },
}); 