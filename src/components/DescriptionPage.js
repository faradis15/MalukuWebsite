import React from 'react';  
import { useParams } from 'react-router-dom';
import './DescriptionPage.css';

// Data untuk deskripsi lokasi
const data = {
    'pantai-ora': {
        image: `${process.env.PUBLIC_URL}/images/recomend1.png`,
        title: 'Pantai Ora',
        team: 'Xperience Place',
        readTime: 'Less than 1 min read',
        description: 'Pantai Ora adalah salah satu tujuan wisata yang terkenal di Pulau Seram, Maluku, Indonesia. Pantai ini terletak di desa Saleman, yang menawarkan keindahan alam yang luar biasa, dengan pasir putih yang lembut dan air laut yang jernih berwarna biru kehijauan. Keindahan alam bawah lautnya yang menakjubkan menjadikannya tempat ideal untuk kegiatan snorkeling dan diving. Pantai Ora juga dikelilingi oleh hutan tropis yang rimbun, menciptakan suasana yang tenang dan alami. Salah satu daya tarik utama Pantai Ora adalah keberadaan resor-resor yang terletak tepat di atas air, menawarkan pemandangan laut yang spektakuler langsung dari kamar. Selain keindahan alamnya, Pantai Ora juga menyajikan berbagai kegiatan air, seperti kayak, berperahu, dan berjemur. Pengunjung dapat menikmati kedamaian dan ketenangan pantai yang masih alami ini, jauh dari keramaian kota. Pantai Ora menjadi pilihan yang tepat bagi mereka yang mencari liburan yang penuh petualangan sekaligus relaksasi di tengah alam yang eksotis. Dengan keindahan yang tiada tara, Pantai Ora semakin populer di kalangan wisatawan domestik dan mancanegara sebagai salah satu destinasi wisata unggulan di Indonesia.',
    },
    'banda-neira': {
        image: `${process.env.PUBLIC_URL}/images/recomend2.png`,
        title: 'Banda Neira',
        team: 'Xperience Place',
        readTime: 'Less than 1 min read',
        description: 'Banda Neira adalah sebuah pulau yang terletak di kepulauan Banda, Maluku, Indonesia. Pulau ini dikenal dengan keindahan alamnya yang luar biasa, termasuk pantai dengan pasir putih, air laut yang jernih, serta kehidupan bawah laut yang kaya akan keanekaragaman hayati. Banda Neira juga memiliki nilai sejarah yang sangat penting karena pada masa lalu, pulau ini merupakan pusat perdagangan rempah-rempah, terutama pala, yang menjadi komoditas utama di dunia pada abad ke-16 hingga ke-19. Pulau ini memiliki beberapa situs bersejarah yang menarik untuk dikunjungi, termasuk Benteng Belgica yang dibangun oleh Belanda sebagai benteng pertahanan, serta rumah-rumah tua yang memperlihatkan jejak sejarah kolonial. Selain itu, Banda Neira juga menawarkan pengalaman budaya yang kaya, dengan penduduk setempat yang ramah dan tradisi yang masih terjaga hingga saat ini. Bagi para pencinta alam dan penyelam, Banda Neira adalah surga tersembunyi dengan keindahan terumbu karang dan kehidupan laut yang menakjubkan. Banyak wisatawan datang ke sini untuk menikmati kegiatan snorkeling dan diving yang menyajikan pemandangan bawah laut yang spektakuler. Karena lokasi pulau ini yang cukup terpencil, Banda Neira menawarkan pengalaman yang tenang dan jauh dari keramaian, menjadikannya tempat yang ideal untuk beristirahat dan menikmati kedamaian alam.',
    },
    'kei-island': {
        image: `${process.env.PUBLIC_URL}/images/recomend3.png`,
        title: 'Kei Island',
        team: 'Xperience Place',
        readTime: 'Less than 1 min read',
        description: 'Kei Island terkenal dengan pantainya yang mempesona, terutama Pantai Ngurtafur, yang memiliki pasir putih halus dan air laut yang jernih. Keindahan alam bawah lautnya juga sangat menakjubkan, menjadikannya tujuan utama bagi para penyelam dan pecinta alam laut. Terumbu karang yang kaya akan biota laut yang beragam membuat pulau ini menjadi tempat yang ideal untuk kegiatan menyelam dan snorkeling. Pulau Kei juga memiliki kekayaan budaya yang kaya, dengan penduduk lokal yang mayoritas adalah suku Kei. Mereka memiliki tradisi dan adat istiadat yang unik, yang dipertahankan hingga sekarang. Kehidupan sehari-hari masyarakat di Kei Island sangat dipengaruhi oleh alam sekitar, dengan sebagian besar penduduk yang bergantung pada pertanian dan perikanan. Kei Island dapat diakses melalui penerbangan dari Ambon, ibu kota Provinsi Maluku, dan juga dengan kapal dari beberapa kota besar di Indonesia. Dengan pesona alam yang masih alami dan budaya yang kaya, Kei Island menjadi tujuan wisata yang semakin populer di Indonesia, khususnya bagi mereka yang mencari ketenangan dan keindahan alam yang belum banyak terjamah.',
    },
    'gunung-binaiya': {
        image: `${process.env.PUBLIC_URL}/images/recomend4.png`,
        title: 'Gunung Binaiya',
        team: 'Xperience Place',
        readTime: 'Less than 1 min read',
        description: 'Gunung Binaiya adalah gunung tertinggi di Provinsi Maluku, Indonesia, dengan ketinggian mencapai 3.027 meter di atas permukaan laut. Terletak di pulau Seram, gunung ini merupakan bagian dari Pegunungan Seram yang terkenal dengan keindahan alamnya yang masih asri dan alami. Gunung Binaiya menjadi daya tarik bagi para pendaki dan pecinta alam yang ingin menikmati pemandangan spektakuler serta pengalaman mendaki yang menantang. Jalur pendakian menuju puncak gunung ini cukup sulit dan memerlukan persiapan fisik yang matang, namun pemandangan dari puncaknya yang menawarkan panorama luas pegunungan dan hutan tropis yang hijau membuat usaha tersebut sangat memuaskan. Selain itu, Gunung Binaiya juga memiliki kekayaan flora dan fauna yang beragam, termasuk berbagai spesies endemik yang hanya bisa ditemukan di daerah tersebut. Beberapa spesies tumbuhan langka dan burung khas Maluku seperti burung cenderawasih, dapat ditemukan di kawasan ini, menjadikannya sebagai tempat yang penting bagi penelitian ekologi dan konservasi. Gunung ini juga memiliki makna budaya dan spiritual bagi masyarakat setempat. Bagi beberapa suku asli di Pulau Seram, Gunung Binaiya dianggap sebagai tempat yang sakral dan dihormati, dengan berbagai cerita rakyat dan tradisi yang berkaitan dengan gunung ini. Dengan segala keindahan alam, kekayaan biota, dan nilai-nilai budaya yang dimilikinya, Gunung Binaiya menjadi salah satu destinasi wisata alam yang sangat dihargai di Maluku.',
    },
};

const DescriptionPage = () => {
    const { id } = useParams(); // Ambil parameter ID dari URL
    const location = data[id]; // Ambil data berdasarkan ID

    if (!location) {
        return <div>Lokasi tidak ditemukan</div>; 
    }

    return (
        <div className="description-page">
            <div className="image-container">
                <img src={location.image} alt={location.title} className="main-image" />
            </div>
            <div className="content">
                <h1 className="title">{location.title}</h1>
                <p className="description">{location.description}</p>
            </div>
        </div>
    );
};

export default DescriptionPage;
