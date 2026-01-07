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
// Optimized: 720p max, no audio, compressed WebM for smaller file size
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

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

  // Intersection Observer for lazy loading video only when visible
  useEffect(() => {
    if (!isMobile) return;

    // Observe the container to detect when hero section enters viewport
    const targetElement = containerRef.current || videoRef.current;
    if (!targetElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            // Load video source only when visible
            if (!shouldLoadVideo) {
              setShouldLoadVideo(true);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.01, // Trigger when 1% visible
      }
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [isMobile, shouldLoadVideo]);

  // Load and play video when it becomes visible
  useEffect(() => {
    if (!isMobile || !videoRef.current || !shouldLoadVideo) return;

    const videoElement = videoRef.current;
    
    // Force video to cover full width
    const forceFullWidth = () => {
      if (videoElement) {
        videoElement.style.width = '100vw';
        videoElement.style.maxWidth = '100vw';
        videoElement.style.left = '0';
        videoElement.style.right = '0';
        videoElement.style.marginLeft = '0';
        videoElement.style.marginRight = '0';
      }
    };
    
    // Force full width immediately
    forceFullWidth();
    
    // Load the video source
    videoElement.load();
    
    // Force full width after load
    videoElement.addEventListener('loadedmetadata', forceFullWidth);
    videoElement.addEventListener('loadeddata', forceFullWidth);
    
    // Attempt to play (may require user interaction on some browsers)
    const playPromise = videoElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Auto-play was prevented, video will play when user interacts
      });
    }
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', forceFullWidth);
      videoElement.removeEventListener('loadeddata', forceFullWidth);
    };
  }, [isMobile, shouldLoadVideo]);

  // Handle window resize to ensure video stays full width
  useEffect(() => {
    if (!isMobile || !videoRef.current) return;

    const handleResize = () => {
      if (videoRef.current) {
        videoRef.current.style.width = '100vw';
        videoRef.current.style.maxWidth = '100vw';
        videoRef.current.style.left = '0';
        videoRef.current.style.right = '0';
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Force resize on mount
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isMobile]);

  const handleShopNow = () => {
    navigate('/collection');
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <div className="carousel-hero-container" ref={containerRef}>
      {/* Video background for mobile view - Optimized with lazy loading */}
      {isMobile && (
        <video
          ref={videoRef}
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={getImagePath('image1.png')}
          aria-label="Hero background video"
        >
          {shouldLoadVideo && (
            <source src={video1Url} type="video/webm" />
          )}
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