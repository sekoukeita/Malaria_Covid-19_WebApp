// Add modules to the require method
require(["esri/WebMap", "esri/views/MapView", "esri/widgets/Legend", "esri/widgets/Swipe", "esri/widgets/Home", 
"esri/widgets/Search", "esri/widgets/LayerList"],
 (WebMap, MapView, Legend, Swipe, Home, Search, LayerList) => {
    
    // Create an instance of the webmap
    const map = new WebMap({
        portalItem: {
            id: "661b933125aa4be4be4dd55ef3962a89"
        }
    });

    // View the map on 2D
    view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 3
    });

    // Add widgets to the map view
    view.when(() => { // when the view is loaded

        // Define the home widget
        const homeBtn = new Home({
            view: view
        });

        // Define the Search widget
        const searchWidget = new Search({
            view: view
        });

        // Add home and search widgets to the UI
        view.ui.add([searchWidget], "top-right");
        view.ui.add(homeBtn, "top-left");

        // Add customized buttons to the map

        // Add initialMap button
        let initialMapTogglebtn = document.createElement("button");
        // copy esri class from developer tool and add a custom "myButton" class to resize the button display size
        initialMapTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        initialMapTogglebtn.innerText = "Iniatial Map";
        initialMapTogglebtn.title = "Click to display the initial map"; // add a tooltip

        // get the top left container elt where the initiale button will be displayed
        topLeftMenuContainer = document.getElementsByClassName("esri-ui-top-left esri-ui-corner")[0];
        topLeftMenuContainer.appendChild(initialMapTogglebtn);

        // Add monovariate button
        let monovariateTogglebtn = document.createElement("button");
        monovariateTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        monovariateTogglebtn.innerText = "Monovariate";
        monovariateTogglebtn.title = "Click to display the monovariate map";
        topLeftMenuContainer.appendChild(monovariateTogglebtn);

        // Add bivariate button
        let bivariateTogglebtn = document.createElement("button");
        bivariateTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        bivariateTogglebtn.innerText = "Bivariate";
        bivariateTogglebtn.title = "Click to display the bivariate map";
        topLeftMenuContainer.appendChild(bivariateTogglebtn);

        // Define the 3 layers to use in the maps after checking their index in the developer tools with the object: map.layers
        const bivariateMortalityRate = map.layers.getItemAt(5);
        const covidMortalityRate = map.layers.getItemAt(4);
        const malariaMortalityRate = map.layers.getItemAt(3);

        // Add customized widgets to the map

        // Define the swipe widget and its toggle button
        let swipeTogglebtn = document.createElement("button");
        swipeTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        swipeTogglebtn.innerText = "Swipe";
        swipeTogglebtn.title ="Click to toggle the swipe widget";
        bottomLeftMenuContainer = document.getElementsByClassName("esri-ui-bottom-left esri-ui-corner")[0];
        bottomLeftMenuContainer.appendChild(swipeTogglebtn);

        let swipeIsVisible = false; // The swipe widget is not visible at this step
        const swipe = new Swipe();   
        swipeTogglebtn.addEventListener("click", () => {
            if (swipeIsVisible == false){
                swipe.view = view;
                swipe.leadingLayers = [covidMortalityRate, malariaMortalityRate]; // monovariate map on top
                swipe.trailingLayers = [bivariateMortalityRate]; // bivariate map on bottom
                swipe.position = 60;  

                view.ui.add(swipe);
                swipeIsVisible = true;
            }
            else{
                swipe.view = null; // remove the swipe from the view. The use of view.ui.remove() does not work
                swipeIsVisible = false;
            }    
        });

        // Define the legend widget and its toggle button
        let legendTogglebtn = document.createElement("button");
        legendTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        legendTogglebtn.innerText = "Legend";
        legendTogglebtn.title = "Click to toggle the legend widget"
        bottomLeftMenuContainer.appendChild(legendTogglebtn);

        let legendIsVisible = false; 
        const legend = new Legend();  
        legendTogglebtn.addEventListener("click", () => {
            if (legendIsVisible == false){
                legend.view = view;
                legend.layerInfos = [{
                    layer: covidMortalityRate,
                    title: "Covid-19 Mortality Rate"
                },
                {
                    layer: malariaMortalityRate,
                    title: "Malaria Mortality Rate"
                },
                {
                    layer: bivariateMortalityRate,
                    title: "bivariate Malaria Mortality Rate"
                }];    

                view.ui.add(legend, "top-right");
                legendIsVisible = true;
            }
            else{
                view.ui.remove(legend);
                legendIsVisible = false;
            }
        });

        // Define the listLayer widget and its toggle button
        let layersTogglebtn = document.createElement("button");
        layersTogglebtn.className = "esri-component esri-home esri-widget--buttom esri-widget myButton";
        layersTogglebtn.innerText = "Layers";
        layersTogglebtn.title = "Click to toggle layers widget"
        bottomLeftMenuContainer = document.getElementsByClassName("esri-ui-bottom-left esri-ui-corner")[0];
        bottomLeftMenuContainer.appendChild(layersTogglebtn);

        let layerListIsVisible = false; 
        const layerList = new LayerList();
        layersTogglebtn.addEventListener("click", () => {  
            if (layerListIsVisible == false){
                layerList.view = view,
                // executes for each ListItem in the LayerList
                layerList.listItemCreatedFunction =  function(event) {

                    // The event object contains properties of the
                    // layer in the LayerList widget.
                    let item = event.item;

                    if (item.title === "Bivarite Africa Malaria and Covid-19 Mortality Rates"){
                        // change the title to something more descriptive
                        item.title = "Bivariate Covid-19 and Malaria Mortality Rates";
                    }
                    if (item.title === "Africa Malaria and Covid-19 Mortality Rates") {
                        item.title = "Covid-19 Mortality Rates";
                    } 
                    if (item.title === "Africa_Malaria_Mortality_Rate_2018"){
                        item.title = "Malaria Mortality Rates";
                    }
                    // prevent the 3 uneccessary layers  from displaying in the layerList widget
                    if (item.title === "Coronavirus COVID-19 Cases V2 - Cases_country"){
                        item.layer.listMode = "hide";
                    }
                    if (item.title === "Africa Countries"){
                        item.layer.listMode = "hide";
                    }
                    if (item.title === "Africa_Malaria_Mortality_Rate_2010_2018"){
                        item.layer.listMode = "hide" 
                    }
                }
                view.ui.add(layerList, {
                    position: "bottom-right"
                });
                layerListIsVisible = true;
            }
            else{
                view.ui.remove(layerList);
                layerListIsVisible = false;
            }
        }); 

        // Add button for displaying the 3 different types of map

        // The map has 3 states:
            // initial: the 3 layers are displayed
            // monovariate: the covid-19 and the malaria univariate layers are displayed
            // bivariate: the bivariate layer Covid-19 (size) and Malaria (color) is displayed
        let mapState = "initial"
        monovariateTogglebtn.onclick = () => {
            swipe.view = null; // don't show the swipe widget
            if(mapState == "initial"){
                bivariateMortalityRate.visible = false; // don't show the layer on the map and in the legend
                bivariateMortalityRate.listMode = "hide"; // don't show the layer name in the layer list
                swipeTogglebtn.style.display = "none"; // don't show the swipe button
                mapState = "monovariate";
            }
            if(mapState == "bivariate"){
                bivariateMortalityRate.visible = false; 
                bivariateMortalityRate.listMode = "hide";
                covidMortalityRate.visible = true;
                covidMortalityRate.listMode = "show";
                malariaMortalityRate.visible = true;
                malariaMortalityRate.listMode = "show";
                mapState = "monovariate";
            }
        }

        bivariateTogglebtn.onclick = () => {
            swipe.view = null;
            if(mapState == "initial"){
                covidMortalityRate.visible = false;
                covidMortalityRate.listMode = "hide";
                malariaMortalityRate.visible = false;
                malariaMortalityRate.listMode = "hide";
                swipeTogglebtn.style.display = "none";
                mapState = "bivariate";  
            }
            if(mapState == "monovariate"){
                bivariateMortalityRate.visible = true; 
                bivariateMortalityRate.listMode = "show";
                covidMortalityRate.visible = false;
                covidMortalityRate.listMode = "hide";
                malariaMortalityRate.visible = false;
                malariaMortalityRate.listMode = "hide";
                mapState = "bivariate";  
            }
        }

        initialMapTogglebtn.addEventListener("click", () => {
            swipe.view = view;
            swipeTogglebtn.style.display = "inline";
            bivariateMortalityRate.visible = true; 
            bivariateMortalityRate.listMode = "show";
            covidMortalityRate.visible = true;
            covidMortalityRate.listMode = "show";
            malariaMortalityRate.visible = true;
            malariaMortalityRate.listMode = "show";
            mapState = "initial";  
        })
    });
});