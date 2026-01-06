import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import './CarouselHero.css';
import { useIsMobile } from '@/hooks/use-mobile';
import { useImagePreloader } from '@/hooks/useImagePreloader';
// WebM video - using ?url suffix for Vite to handle it as an asset
import video1Url from '@/assets/video/video1.WebM?url';

interface SlideData {
  id: string;
  title: string;
  price: string;
  contentTitle: string;
  contentSubtitle: string;
  bgImage: string;
  productImage: string;
  bgColor: string;
}

// Helper function to get image path
const getImagePath = (imageName: string) => {
  return `/assets/hero_section/${imageName}`;
};

const slides: SlideData[] = [
  {
    id: 'romantic',
    title: 'Romantic',
    price: '$49.90',
    contentTitle: 'Express your love with timeless elegance.',
    contentSubtitle: 'Our romantic collection features premium roses and delicate blooms, carefully arranged to convey your deepest emotions. Perfect for anniversaries, proposals, and special moments.',
    bgImage: getImagePath('image1-bg.png'),
    productImage: getImagePath('image1.png'),
    bgColor: '#ff0000'
  },
  {
    id: 'elegant',
    title: 'Elegant',
    price: '$59.90',
    contentTitle: 'Sophisticated arrangements for refined occasions.',
    contentSubtitle: 'Discover our elegant collection of premium florals, handcrafted by master florists. Each arrangement tells a story of luxury and sophistication, perfect for corporate events and formal celebrations.',
    bgImage: getImagePath('image2-bg.png'),
    productImage: getImagePath('image2.png'),
    bgColor: '#e9bf8b'
  },
  {
    id: 'luxury',
    title: 'Luxury',
    price: '$79.90',
    contentTitle: 'Exquisite blooms for the most discerning tastes.',
    contentSubtitle: 'Our luxury collection features rare and exotic flowers, arranged with artistic precision. Each piece is a masterpiece, designed to make a statement and create unforgettable impressions.',
    bgImage: getImagePath('image3-bg.png'),
    productImage: getImagePath('image3.png'),
    bgColor: '#b6d6c8'
  },
  {
    id: 'celebration',
    title: 'Celebration',
    price: '$69.90',
    contentTitle: 'Vibrant arrangements to brighten every celebration.',
    contentSubtitle: 'Celebrate life\'s special moments with our vibrant collection. From birthdays to graduations, our celebration bouquets bring joy and color to any occasion, crafted with care and attention to detail.',
    bgImage: getImagePath('image4-bg.png'),
    productImage: getImagePath('image4.png'),
    bgColor: '#e86357'
  }
];

const CarouselHero = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Collect all images for preloading
  const allSlideImages = slides.flatMap(slide => [slide.productImage, slide.bgImage]);
  const firstSlideImages = [slides[0].productImage, slides[0].bgImage];

  // Preload all images
  useImagePreloader(allSlideImages);

  // Add preload link tags for critical images
  useEffect(() => {
    const preloadLinks: HTMLLinkElement[] = [];
    const existingPreloads = new Set(
      Array.from(document.querySelectorAll('link[rel="preload"]')).map(
        (link) => (link as HTMLLinkElement).href
      )
    );

    // Preload first slide with high priority
    firstSlideImages.forEach((src) => {
      const fullPath = new URL(src, window.location.origin).href;
      if (!existingPreloads.has(fullPath)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
        preloadLinks.push(link);
      }
    });

    // Preload other slides with lower priority
    slides.slice(1).forEach((slide) => {
      [slide.productImage, slide.bgImage].forEach((src) => {
        const fullPath = new URL(src, window.location.origin).href;
        if (!existingPreloads.has(fullPath)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.fetchPriority = 'low';
          document.head.appendChild(link);
          preloadLinks.push(link);
        }
      });
    });

    return () => {
      preloadLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, []);

  // Set body data attribute for styling
  useEffect(() => {
    document.body.setAttribute('data-sld', String(currentSlide));
    
    return () => {
      document.body.removeAttribute('data-sld');
    };
  }, [currentSlide]);

  // Mark images as loaded after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setImagesLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleShopNow = () => {
    navigate('/collection');
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <div className="carousel-hero-container" ref={containerRef}>
      {/* Video background for mobile view */}
      {isMobile && (
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={video1Url} type="video/webm" />
        </video>
      )}
      <div className="carousel-hero-wrapper">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          speed={800}
          autoplay={{
            delay: isMobile ? 2500 : 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            el: '.swiper-pagination',
            type: 'fraction',
            formatFractionCurrent: (number) => String(number),
            formatFractionTotal: (number) => String(number),
          }}
          observer={true}
          observeParents={true}
          watchSlidesProgress={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Update Swiper dimensions after initialization
            setTimeout(() => {
              swiper.update();
              swiper.updateSize();
              swiper.updateSlides();
            }, 100);
          }}
          onSlideChange={handleSlideChange}
          onResize={(swiper) => {
            swiper.update();
            swiper.updateSize();
            swiper.updateSlides();
          }}
          className="mySwiper"
        >
          {(isMobile ? [...slides, ...slides.slice(0, 2)] : slides).map((slide, index) => (
            <SwiperSlide key={`${slide.id}-${index}`} className="main">
              <div className="left-side">
                <div className="main-wrapper">
                  <h3 className="main-header">Bexy Flowers</h3>
                  <h1 className="main-title">{slide.title}</h1>
                  <h2 className="main-subtitle">{slide.price}</h2>
                </div>
                <div className="main-content">
                  <div className="main-content__title">{slide.contentTitle}</div>
                  <div className="main-content__subtitle">{slide.contentSubtitle}</div>
                  <button 
                    className="more-menu" 
                    onClick={handleShopNow}
                    aria-label={`Shop ${slide.title} collection`}
                  >
                    Shop Now
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.7" 
                      stroke="currentColor" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="15" y1="16" x2="19" y2="12" />
                      <line x1="15" y1="8" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              
                <div className="center">
                  <div 
                    className="right-side__img"
                    style={{
                      backgroundColor: slide.bgColor
                    }}
                  >
                    <img
                      className="bottle-img"
                      src={slide.productImage}
                      alt={`${slide.title} flower arrangement`}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "low"}
                      onLoad={() => {
                        // Update Swiper when images load
                        if (swiperRef.current) {
                          setTimeout(() => {
                            swiperRef.current?.update();
                            swiperRef.current?.updateSize();
                            swiperRef.current?.updateSlides();
                          }, 50);
                        }
                      }}
                    />
                  </div>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination" aria-label="Slide navigation"></div>
      </div>
    </div>
  );
};

export default CarouselHero;