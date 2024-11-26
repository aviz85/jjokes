import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type JokeVersion = Database['public']['Tables']['joke_versions']['Row'];

export default function JokeDetailScreen({ route }: any) {
  const { joke } = route.params;
  const [versions, setVersions] = useState<JokeVersion[]>([]);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    const { data, error } = await supabase
      .from('joke_versions')
      .select('*')
      .eq('joke_id', joke.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error);
      return;
    }

    if (data) {
      setVersions(data);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.original}>{joke.original}</Text>
        <Text style={styles.meta}>דירוג: {joke.rating}</Text>
        <Text style={styles.meta}>תגיות: {joke.tags}</Text>
      </View>

      <Text style={styles.versionsTitle}>גרסאות:</Text>
      {versions.map(version => (
        <View key={version.id} style={styles.versionCard}>
          <Text style={styles.versionText}>{version.text}</Text>
          <Text style={styles.versionMeta}>סוג: {version.type}</Text>
          <Text style={styles.versionMeta}>
            {new Date(version.timestamp).toLocaleDateString('he-IL')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  original: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  meta: {
    color: '#666',
    marginBottom: 5,
  },
  versionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    margin: 15,
  },
  versionCard: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  versionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  versionMeta: {
    color: '#666',
    fontSize: 12,
  },
}); 