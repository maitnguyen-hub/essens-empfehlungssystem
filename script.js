
        let recipes = [];
        let selectedCategory = null;
        let selectedTags = [];

        // Rezepte laden
        async function loadRecipes() {
            try {
                const response = await fetch('recipe.json'); // Pfad zu deiner recipe.json
                recipes = await response.json();
                filterRecipes();  // Nach dem Laden filtern
            } catch (error) {
                console.error("Fehler beim Laden der Rezepte:", error);
            }
        }

        // Rezepte filtern und anzeigen
        function filterRecipes() {
            const tableBody = document.getElementById('recipeTable').getElementsByTagName('tbody')[0];

            // Vorhandene Zeilen entfernen
            tableBody.innerHTML = '';

            // Nehme Status von Nährungsfilter (vegetarisch, Vegan, halal, glutenfrei)
            const vegetarischChecked = document.getElementById('vegetarisch').checked;
            const VeganChecked = document.getElementById('Vegan').checked;
            const halalChecked = document.getElementById('halal').checked;
            const glutenfreiChecked = document.getElementById('glutenfrei').checked;

            // Filter anwenden
                const filteredRecipes = recipes.filter(recipe => {
                const categoryMatch = !selectedCategory || recipe["Art des Gerichts (Frühstück, Hauptgericht, Snack, Dessert, Salat)"] === selectedCategory;
                const tagMatch = selectedTags.every(tag => recipe["Geschmacksrichtung (süß, salzig, sauer, bitter, herzhaft)"].includes(tag));

                //Checke die Bedingungen
                const vegetarischMatch = !vegetarischChecked || recipe["Wichtige Inhalte (ob es Vegan, vegetarisch, glutenfrei, halal)"].toLowerCase().includes("vegetarisch");
                const VeganMatch = !VeganChecked || recipe["Wichtige Inhalte (ob es Vegan, vegetarisch, glutenfrei, halal)"].toLowerCase().includes("vegan");
                const halalMatch = !halalChecked || recipe["Wichtige Inhalte (ob es Vegan, vegetarisch, glutenfrei, halal)"].toLowerCase().includes("halal");
                const glutenfreiMatch = !glutenfreiChecked || recipe["Wichtige Inhalte (ob es Vegan, vegetarisch, glutenfrei, halal)"].toLowerCase().includes("glutenfrei");

                return categoryMatch && tagMatch && vegetarischMatch && VeganMatch && halalMatch && glutenfreiMatch;
            });

            // Rezepte in die Tabelle einfügen
            filteredRecipes.forEach(recipe => {
                const row = tableBody.insertRow();
                const cellName = row.insertCell(0);
                cellName.innerText = recipe["Name des Gerichts"];

                const cellCategory = row.insertCell(1);
                cellCategory.innerText = recipe["Art des Gerichts (Frühstück, Hauptgericht, Snack, Dessert, Salat)"];

                const cellTags = row.insertCell(2);
                cellTags.innerText = recipe["Wichtige Inhalte (ob es Vegan, vegetarisch, glutenfrei, halal)"];

                const cellGeschmack = row.insertCell(3);
                cellGeschmack.innerText = recipe["Geschmacksrichtung (süß, salzig, sauer, bitter, herzhaft)"];
                
                const cellZutaten = row.insertCell(4);
                cellZutaten.innerText = recipe["Zutaten"];

                const cellBeschreibung = row.insertCell(5);
                cellBeschreibung.innerText = recipe["Beschreibung"];
            });
        }

        // Diagramm erstellen und initialisieren
        let categoryChart;
        function createPieChart(data, labels, onClick) {
            const ctx = document.getElementById('pieChart').getContext('2d');
            return new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: data,
                        backgroundColor: ['#FFF5E4', '#6A9C89', '#CD5C08', '#758467', '#CBD5C0' ],
                    }],
                    labels: labels
                },
                options: {
                    responsive: true,
                    onClick: onClick
                }
            });
        }

        function initializeChart() {
            categoryChart = createPieChart(
                [1, 1, 1, 1, 1], 
                ['Frühstück', 'Hauptgericht', 'Snack', 'Dessert', 'Salat'],
                function (event, elements) {
                    if (elements.length > 0) {
                        const clickedIndex = elements[0].index;
                        selectedCategory = categoryChart.data.labels[clickedIndex];

                        categoryChart.data.datasets[0].data = [1];
                        categoryChart.data.labels = [selectedCategory];
                        categoryChart.update();

                        showTagCheckboxes();
                        filterRecipes(); // Filter aufrufen, wenn Kategorie ausgewählt wird
                    }
                }
            );
        }

        function showTagCheckboxes() {
            document.getElementById('tagCheckboxes').style.display = 'block';
            document.getElementById('resetButton').style.display = 'block';
        }

        function resetSelection() {
            selectedCategory = null;
            selectedTags = [];

            categoryChart.data.datasets[0].data = [1, 1, 1, 1, 1];
            categoryChart.data.labels = ['Frühstück', 'Hauptgericht', 'Snack', 'Dessert', 'Salat'];
            categoryChart.update();

            document.getElementById('tagCheckboxes').style.display = 'none';
            document.getElementById('resetButton').style.display = 'none';
            document.querySelectorAll('.tag').forEach(checkbox => checkbox.checked = false);

            filterRecipes();  // Zurücksetzen und alles anzeigen
        }

        // Änderungen an den Tag-Checkboxen überwachen
        document.querySelectorAll('.tag').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                selectedTags = Array.from(document.querySelectorAll('.tag:checked')).map(cb => cb.value);
                filterRecipes(); // Filter aufrufen, wenn sich die Tags ändern
            });
        });

        // Ernährungsfilter überwachen
        document.getElementById('vegetarisch').addEventListener('change', filterRecipes);
        document.getElementById('Vegan').addEventListener('change', filterRecipes);
        document.getElementById('halal').addEventListener('change', filterRecipes);
        document.getElementById('glutenfrei').addEventListener('change', filterRecipes);
        

        window.onload = function() {
            initializeChart();
            loadRecipes();  // JSON-Daten laden
        };

   
        
    