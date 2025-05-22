// MySwiper.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './swiper.module.scss';  // 模块化 SCSS
import Img from '@/assets/img/bg.jpg';
import Img2 from '@/assets/img/globe.jpg';
import Img3 from '@/assets/img/location.png';



const MySwiper = () => {
  // 幻灯片数据（可扩展为动态传入）
  const slides = [
    { id: 1, image: Img, alt: '轮播图1' },
    { id: 2, image: Img2, alt: '轮播图2' },
    { id: 3, image: Img3, alt: '轮播图3' },
    { id: 4, image: Img, alt: '轮播图1' },
    { id: 5, image: Img2, alt: '轮播图2' },
    { id: 6, image: Img3, alt: '轮播图3' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideContainerRef = useRef(null);  // 轮播容器 ref
  const autoPlayInterval = useRef();       // 自动播放定时器

  // 自动播放逻辑
  useEffect(() => {
    autoPlayInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(autoPlayInterval.current);  // 组件卸载时清理
  }, [slides.length]);

  // 手动切换上一张
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    resetAutoPlay();  // 切换后重置自动播放
  };

  // 手动切换下一张
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
    resetAutoPlay();  // 切换后重置自动播放
  };

  // 点击分页点切换
  const goToSlide = (index) => {
    setCurrentIndex(index);
    resetAutoPlay();  // 切换后重置自动播放
  };

  // 重置自动播放（避免手动操作后立即跳转）
  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval.current);
    autoPlayInterval.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 3000);
  };

  return (
    <div className={styles.swiperContainer}>
      {/* 轮播内容容器 */}
      <div
        className={styles.slideWrapper}
        ref={slideContainerRef}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,  // 核心滑动逻辑
          transition: 'transform 0.5s ease'  // 切换动画
        }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className={styles.slide}>
            <img
              src={slide.image}
              alt={slide.alt}
              className={styles.slideImg}
            />
          </div>
        ))}
      </div>

      {/* 左右切换箭头 */}
      <button
        className={styles.prevBtn}
        onClick={handlePrev}
        aria-label="上一张"
      >
        ❮
      </button>
      <button
        className={styles.nextBtn}
        onClick={handleNext}
        aria-label="下一张"
      >
        ❯
      </button>

      {/* 分页点 */}
      <div className={styles.pagination}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.paginationDot} ${currentIndex === index ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`跳转到第${index + 1}页`}
          />
        ))}
      </div>
    </div>
  );
};

export default MySwiper;