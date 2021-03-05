// import Baloon from './Baloon'

// export default class Map {
//     constructor() {
//         ymaps.ready(this.init.bind(this));
//     }

//     init() {
//         this.map = new ymaps.Map('ymap', {
//             center: [55.751574, 37.573856],
//             zoom: 9
//         });
        
//         this.map.events.add('click', (event) => {
//             this.map.balloon.open(
//                 event.get('coords'), 
//                 document.querySelector('#templateBaloon').innerHTML
//             )
//         })
//     }
// }

export default class Map {
    constructor(mapId, onClick) {
        this.mapId = mapId;
        this.onClick = onClick;
    }

    async init() {
        await this.injectYmapsScript();
        await this.loadYMaps();
        this.initMap();
    }

    injectYmapsScript() {
        return new Promise( (resolve) => {
            const ymapsScript = document.createElement('script');
            ymapsScript.src = 'https://api-maps.yandex.ru/2.1/?apikey=64c304b6-d384-4c4c-9e59-de8378a23e2b&lang=ru_RU';
            document.body.appendChild(ymapsScript);
            ymapsScript.addEventListener('load', resolve);
        })
    }

    loadYMaps() {
        return new Promise((resolve) => ymaps.ready(resolve));
    }

    initMap() {
        this.clusterer = new ymaps.Clusterer({
            groupByCoordinates: true,
            clusterDisableClickZoom: true,
            hasBalloon: false
        });

        this.clusterer.events.add('click', (e) => {
            console.log(e.get('target').geometry.getCoordinates());
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.map = new ymaps.Map(this.mapId, {
            center: [55.751574, 37.573856],
            zoom: 9
        });
        this.map.events.add('click', (e) => this.onClick(e.get('coords')));
        this.map.geoObjects.add(this.clusterer);
    }

    openBalloon(coords, content) {
        this.map.balloon.open(coords, content, {
            minWidth: 350, 
        });
    }

    setBaloonContent(content) {
        this.map.balloon.setData(content)
    }

    closeBalloon() {
        this.map.balloon.close();
    }

    createPlacemark(coords) {
        const placemark = new ymaps.Placemark(coords);
        placemark.events.add('click', (e) => {
            const coords = e.get('target').geometry.getCoordinates();
            this.onClick(coords);
        });
        this.clusterer.add(placemark);
    }
}