import * as React from 'react';
import { Button, View, StyleSheet, TextInput, Alert, FlatList, Text } from 'react-native';

export const App = () => {
  const [todo, onChangeTodo] = React.useState('');
  const [tareas, setTareas] = React.useState([]); // estado para las tareas del servidor

  const BASE_URL = 'https://todolistapprender.onrender.com';

  // GET: Obtener lista de tareas del servidor
  const fetchTodos = async () => {
    try {
      const response = await fetch(`${BASE_URL}/lista_todos`);
      const json = await response.json();
      setTareas(json.todos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la lista de tareas');
      console.error('Error al obtener tareas:', error);
    }
  };

  // POST: Agregar nueva tarea
  const addTodo = async () => {
    const todoData = { todo: todo };

    try {
      const response = await fetch(`${BASE_URL}/agrega_todo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });

      const responseData = await response.json();
      console.log('Respuesta de la API:', responseData);

      if (response.status === 201) {
        Alert.alert('Éxito', 'Todo guardado exitosamente');
        onChangeTodo(''); // limpia el input
        fetchTodos(); // actualiza la lista después de agregar
      } else {
        Alert.alert('Error', 'No se pudo guardar el todo');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión con el servidor');
      console.error('Error al hacer la solicitud:', error);
    }
  };

  // GET inicial al cargar la app
  React.useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="todo"
        value={todo}
        onChangeText={(text) => onChangeTodo(text)}
      />

      <Button title="Agregar todo" onPress={addTodo} />

      <FlatList
        style={styles.lista}
        data={tareas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.todo}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 50,
  },
  textInput: {
    height: 40,
    padding: 8,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
  },
  lista: {
    marginTop: 20,
  },
  item: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;