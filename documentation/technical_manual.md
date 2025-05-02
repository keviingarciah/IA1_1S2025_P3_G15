# Manual Técnico

MazeBot es un simulador tridimensional de resolución de laberintos desarrollado por losestudiantes del curso de Inteligencia Artificial 1 de la Universidad de San Carlos de Guatemala. Su propósito es introducir a los estudiantes en la simulación de entornos inteligentes, combinando elementos de lógica, visualización tridimensional y algoritmos de búsqueda de caminos.

MazeBot permite diseñar laberintos de manera dinámica mediante archivos JSON configurables, e implementa un robot virtual que analiza su entorno y determina la mejor ruta desde un punto de inicio hasta una meta. El proyecto aplica conocimientos adquiridos en programación, estructuras de datos, simulación y uso de bibliotecas como p5.js y Three.js, consolidando la formación técnica de los estudiantes y su capacidad para construir soluciones inteligentes visualmente atractivas.

## Instalación

Para poder hacer uso de MazeBot, y realizar cambios directamente en código, es necesario que clonemos el repositorio actual para poder tener acceso al código, para ello ingresamos el siguiente comando:

```sh
git clone https://github.com/keviingarciah/IA1_1S2025_P3_G15.git
```

Y para comprender el flujo de todo nuestro proyecto, ubiquese en el archivo: `/js/main.js`, para comprender las herramientas utilizadas y el flujo completo de MazeBot.

## Estructura de arquitectura

La estructura para este proyecto sigue una estructura básica pero funcional y escalable, por lo que se implementa una estructuración de carpetas, con el fin de distribuir todo el flujo en distintos archivos, para manejarlos de manera ordenada y eficaz, de la siguiente manera:

```sh
- /
---- /css
        - styles.css
---- /data
        - maze-runner.json
        - maze.json
---- /js
        - algorithm_select.js
        - config_loader.js
        - controls.js
        - main.js
        - maze_config.js
        - maze_model.js
        - pathfinder_astar.js
        - pathfinder_bfs.js
        - pathfinder_dfs.js
        - pathfinder_dijkstra.js
        - robot_model.js
        - simulation_menu.js
```

## Descripción de la arquitectura

A continuación se describen los detalles de cada uno de los archivos que componen la estructura de este sistema.

- ### **css/**
    - #### **styles.css** 
    
        Este archivo, es un archivo global, en el cual se incluye todo el estilado de nuestro sistema, para manejarlo de una manera global y centralizada.


- ### **data/**
 
    Todos los archivos que se encuentran en esta carpeta, son los archivos que contienen la configuración de los laberitnos que el sistema podra manejar y dibujar, es decir si se desea crear nuevos, podran hacerse en esta carpeta, todos con extension `.json`.

 - ### **js/**
    - #### **algorithm_selector.js**

        Este archivo define una clase AlgorithmSelector que crea un componente de interfaz para seleccionar un algoritmo de búsqueda. Muestra un menú desplegable y un botón para iniciar la simulación. Al seleccionar un algoritmo y hacer clic, ejecuta un callback con la opción elegida.

    - #### **config_loader.js**
        
        Este archivo define la clase ConfigLoader, que carga y valida un archivo JSON con la configuración de un laberinto. Verifica campos obligatorios y formatos correctos. También configura un listener para manejar la carga del archivo desde un input HTML.

    - #### **controls.js**
        
        Este archivo define la clase `Controls`, que configura los controles interactivos de cámara usando `THREE.OrbitControls`. Permite mover, rotar y hacer zoom suavemente sobre la escena 3D. También establece límites y velocidades para mejorar la experiencia de navegación.

    - #### **main.js**
        
        Este archivo define la clase principal `MazeApp`, que coordina la carga de configuración, selección del algoritmo, creación del laberinto, simulación del robot y controles 3D. Integra todos los módulos del sistema para inicializar, ejecutar y reiniciar simulaciones visuales con diferentes algoritmos de búsqueda. También maneja la interfaz y animación de la escena en Three.js.

    - #### **maze_config.js**
        
        Este archivo define la clase `MazeConfig`, que almacena y gestiona la configuración del laberinto. Permite cargar datos desde un JSON y ofrece métodos para verificar si una celda es una pared, el inicio o el fin del laberinto.

    - #### **maze_model.js**

        Este archivo define la clase `MazeModel`, que gestiona la creación y visualización del laberinto en una escena de Three.js. Utiliza la configuración cargada para generar paredes, suelo, y manejar luces en la escena. También ofrece métodos para rotar el laberinto y actualizar sus dimensiones dinámicamente.

    - #### **pathfinder_astar.js**

        Este archivo define la clase `PathFinderAStar`, que implementa el algoritmo de búsqueda A* para encontrar el camino más corto en un laberinto. Utiliza una heurística de distancia Manhattan y tiene métodos para calcular los vecinos, evaluar los costos de los movimientos, y reconstruir el camino encontrado. Además, ofrece una visualización del laberinto con el camino marcado en la consola.

        - **Métodos Clave:**
            
            - **`heuristic(pos)`**: Calcula la distancia Manhattan entre la posición actual y el destino.
            
            - **`isWall(x, y)`**: Verifica si una celda es una pared.
            
            - **`getNeighbors(x, y)`**: Obtiene los vecinos accesibles de una celda.
            
            - **`findPath()`**: Ejecuta el algoritmo A* para encontrar el camino.
            
            - **`reconstructPath(endNode)`**: Reconstruye el camino desde el nodo final hasta el inicio.
            
            - **`logPath(path)`**: Muestra el camino encontrado en la consola en formato ASCII.


    - #### **pathfinder_bfs.js**

        Este código implementa un algoritmo de búsqueda en anchura (BFS) para encontrar un camino en un laberinto, evitando obstáculos. Utiliza una cola para explorar vecinos válidos y visualiza el resultado en ASCII.


    - #### **pathfinder_dfs.js**

        Este código implementa un algoritmo de búsqueda en profundidad (DFS) para encontrar un camino en un laberinto. Explora recursivamente las rutas posibles, evitando obstáculos y visualizando el resultado en ASCII.


    - #### **pathfinder_dijkstra.js**

        Este código implementa el algoritmo de Dijkstra para encontrar el camino más corto en un laberinto. Asigna costos a cada movimiento, priorizando las rutas menos costosas, y visualiza el resultado en ASCII.


    - #### **robot_model.js**

        Este código define un modelo de robot en Three.js con articulaciones animadas, luces y efectos de propulsión. Puede seguir un camino en un laberinto y realizar animaciones de movimiento y celebración.


    - #### **simulation_menu.js**

        Este código define un menú para controlar una simulación, permitiendo reiniciar la animación, cambiar de algoritmo o cargar un nuevo laberinto. Usa eventos para gestionar las interacciones del usuario.

## Herramientas utilizadas

- ### **Three.js**

    Biblioteca JavaScript para renderizar gráficos 3D en el navegador utilizando WebGL, permitiendo la creación de escenas, luces, sombras y modelos 3D interactivos.

- ### **OrbitControls**

    Extensión de Three.js que permite controlar la cámara mediante interacciones del usuario, como rotación, acercamiento y desplazamiento, ideal para exploración de escenas.

- ### **Tween.js**

    Biblioteca para animaciones suaves en JavaScript, utilizada para interpolar valores con diferentes curvas de aceleración, facilitando movimientos fluidos en gráficos y interfaces.

## Algoritmos utilizados

- ### **Breadth-First Search (BFS)**  

    Busca en anchura explorando todos los nodos de un nivel antes de pasar al siguiente. Es ideal para encontrar la ruta más corta en grafos no ponderados, garantizando la solución óptima en estos casos.

    - #### **Justificación:**  

        Se utiliza en laberintos cuando todas las transiciones tienen el mismo costo y es necesario encontrar el camino más corto con seguridad. Su uso es apropiado para problemas donde no hay pesos en los movimientos.

---

- ### **Depth-First Search (DFS)**  

    Busca en profundidad siguiendo una ruta hasta alcanzar el objetivo o quedar sin opciones antes de retroceder. Es útil para recorrer estructuras y explorar soluciones posibles en problemas de exploración.

    - #### **Justificación:**  

        Se emplea cuando se desea una solución rápida sin optimización de costos. Es útil para problemas donde la prioridad es encontrar una ruta sin importar si es la más corta o la más eficiente.

---

- ### **A*** Search  

    Combina búsqueda heurística con búsqueda de costo mínimo, usando una función de evaluación que equilibra distancia recorrida y estimación de distancia restante. Es eficiente y preciso para encontrar rutas óptimas.

    - #### **Justificación:**  

        Se usa en laberintos donde hay pesos en los movimientos y se busca el camino más eficiente. Su heurística permite reducir el espacio de búsqueda y encontrar rutas óptimas de manera eficiente.

---

- ### **Dijkstra's Algorithm**  

    Encuentra el camino más corto en un grafo ponderado considerando el costo acumulado para llegar a cada nodo. Explora todas las opciones óptimas hasta hallar la mejor ruta.

    - #### **Justificación:**  

        Se aplica cuando cada movimiento tiene un costo diferente y se requiere la solución más económica. Es útil para encontrar la mejor ruta en sistemas con pesos desiguales y garantizar una solución óptima.