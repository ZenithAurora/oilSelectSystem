// HomePage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Home.module.scss';
import Icon1 from '@/assets/img/Icon1.png';
import Icon2 from '@/assets/img/Icon2.png';
import Icon3 from '@/assets/img/Icon3.png';
import OilInformation from '@/assets/img/oilInformation.png'

import userAvatar from '@/assets/img/avatar.png';
import ourSystemIntroduction from '@/assets/img/oilIntroduce.png';


const HomePage = () => {
  const [user] = useState({
    name: "admin",
    avatar: userAvatar
  });

  const handleLogout = () => {
    // 先确认是否退出登录
    if (window.confirm("确定要退出登录吗？")) {
      window.location.href = "/"; // 跳转到登录页
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        duration: 0.8
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className={styles.homeContainer}>
      {/* 头部导航 */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <h1 className={styles.title}>智能甜点预测</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>核心功能</a>
          <a href="#solutions" className={styles.navLink}>解决方案</a>
          <a href="#about" className={styles.navLink}>关于我们</a>
          <div className={styles.userPanel}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <img
                src={user.avatar}
                alt="用户头像"
                className={styles.userAvatar}
              />
            </div>
            <div className={styles.dropdownMenu}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <span className={styles.logoutIcon}>⏻</span>
                退出登录
              </button>
            </div>
          </div>

        </nav>
      </header>

      <div className={styles.mainContent}>
        {/* 首页网站介绍 */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>页岩油甜点预测系统</h2>

          <div className={styles.ctaContent}>
            <div className={styles.catSectionLeft}>
              <p className={styles.oilIntroduce}>
                页岩油是一种沉积在页岩层中的烃类化合物，主要由古代
                有机物质在地质历史时期经历长时间的热解作用形成。这种石油资源
                通常储存在岩石的微孔隙和裂缝中，其开采需要采用先进的水平钻井
                和水力压裂技术来提高产量。页岩油的勘探开发对于我国保障能源安
                全、加速能源转型具有重大意义。
              </p>
              <br />

              <p className={styles.oilIntroduce}>
                油然而生-页岩油甜点智能预测评价系统是一种基于人工智能和
                大数据技术的页岩油开采评价系统。团队利用自主研发的计算方法，
                并结合页岩油地质规律成功研发。该系统可提高页岩油开采效率，并
                对日常页岩油开采环节进行智能评估与优化，对页岩油开采潜力、生
                产效率进行智能化分析，助力勘探成功并寻得甜点，将
                原有的复杂数据简单化。同时，用户可利用系统的数据可视化和交互
                分析工具，对比不同的页岩油资源与开发方案，拥有更多选择
              </p>
            </div>

            <div className={styles.catSectionRight}>
              <img src={ourSystemIntroduction} alt="项目介绍" className={styles.systemIntroduce} />
            </div>
          </div>

        </section>

        {/* 主内容区 */}
        <motion.section
          className={styles.hero}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>页岩油勘探的智能革命</h2>
            <p className={styles.heroSubtitle}>
              融合AI算法与地质大数据，精准定位页岩油富集区，勘探效率提升80%+
            </p>
            <motion.div className={styles.stats} variants={cardVariants}>
              <div className={styles.statCard}>
                <h3>100+区块</h3>
                <p>已验证甜点区域</p>
              </div>
              <div className={styles.statCard}>
                <h3>92%</h3>
                <p>储存识别准确率</p>
              </div>
              <div className={styles.statCard}>
                <h3>72h</h3>
                <p>单区块完整评估周期</p>
              </div>
              <div className={styles.statCard}>
                <h3>40%</h3>
                <p>勘探成本降低</p>
              </div>
            </motion.div>
          </div>
          <div className={styles.heroImage}>
            <img src={OilInformation} alt="Pipeline" className={styles.pipelineImg} />
          </div>
        </motion.section>

        {/* 功能区块 */}
        <section id="features" className={styles.features}>
          <h2 className={styles.sectionTitle}>核心功能</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <img src={Icon1} alt="数据可视化" className={styles.featureIcon} />
              <h3>智能数据可视化</h3>
              <p>三维地质模型动态展示，多维度参数实时分析</p>
            </div>
            <div className={styles.featureCard}>
              <img src={Icon2} alt="全球覆盖" className={styles.featureIcon} />
              <h3>全域勘探优化</h3>
              <p>覆盖松辽、鄂尔多斯等主要盆地，支持全球区块部署</p>
            </div>
            <div className={styles.featureCard}>
              <img src={Icon3} alt="管道模拟" className={styles.featureIcon} />
              <h3>全流程模拟系统</h3>
              <p>水平井设计→压裂效果预测→产能评估一体化解决方案</p>
            </div>
          </div>
        </section>

        {/* 解决方案 */}
        <section id="solutions" className={styles.solutions}>
          <h2 className={styles.sectionTitle}>行业解决方案</h2>
          <div className={styles.solutionGrid}>
            <div className={styles.introduceContainer}>
              {/* 流程时间线 */}
              <div className={styles.processTimeline}>
                <div className={styles.timelineItem}>
                  <div className={styles.node}></div>
                  <h5>数据采集阶段</h5>
                  <p>多源异构数据标准化接入</p>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.node}></div>
                  <h5>智能分析阶段</h5>
                  <p>深度学习特征提取</p>
                </div>
                <div className={styles.timelineItem}>
                  <div className={styles.node}></div>
                  <h5>可视化输出</h5>
                  <p>三维地质模型构建</p>
                </div>
              </div>

              {/* 新增技术优势模块 */}
              <div className={styles.techAdvantage}>
                <div className={styles.advantageCard}>
                  <div className={styles.glowBar}></div>
                  <div className={styles.hexIcon}>⛭</div>
                  <h4>核心技术突破</h4>
                  <ul className={styles.techList}>
                    <li>地质参数智能解译算法</li>
                    <li>裂缝网络三维重构技术</li>
                    <li>多源数据融合分析引擎</li>
                    <li>深度学习模型训练与优化</li>
                    <li>智能决策支持系统</li>
                    <li>全球覆盖能力提升</li>
                  </ul>
                </div>
              </div>
              <div className={styles.techAdvantage}>
                <div className={styles.advantageCard}>
                  <div className={styles.glowBar}></div>
                  <div className={styles.hexIcon}>⚙</div>
                  <h4>智能勘探技术矩阵</h4>
                  <ul className={styles.techList}>
                    <li>地质参数AI解译系统（准确率≥92%）</li>
                    <li>裂缝网络智能建模引擎v2.0</li>
                    <li>多数据融合分析平台（数据实时解析）</li>
                    <li>自主进化AI模型（迭代准确率年提升15%）</li>
                    <li>勘探方案智能推荐系统（效率提升200%）</li>
                    <li>全球覆盖能力提升（支持全球区块部署）</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.rightItemContainer}>
              <div className={styles.solutionItem}>
                <h3>成熟区块挖潜</h3>
                <p>剩余油分布预测，采收率提升15-22%</p>
              </div>
              <div className={styles.solutionItem}>
                <h3>新区快速评价</h3>
                <p>数据智能解译+甜点区快速圈定，周期缩短50%</p>
              </div>
              <div className={styles.solutionItem}>
                <h3>压裂方案优化</h3>
                <p>裂缝扩展模拟与产能预测，单井产量提升30%</p>
              </div>
              <div className={styles.solutionItem}>
                <h3>实时生产监控</h3>
                <p>井下参数实时采集与智能预警，故障响应效率提升60%</p>
              </div>
            </div>
          </div>
        </section>



        {/* 页脚 */}
        <footer className={styles.footer}>
          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <h4>公司信息</h4>
              <p>西南石油大学产学研成果</p>
              <p>© 2025 创数据团队 版权所有</p>
            </div>
            <div className={styles.footerColumn}>
              <h4>快速链接</h4>
              <a href="#">产品手册</a>
              <a href="#">技术白皮书</a>
              <a href="#">客户案例</a>
            </div>
            <div className={styles.footerColumn}>
              <h4>联系我们</h4>
              <p>电话：+86 18882513639</p>
              <p>邮箱：2985395460@qq.com</p>
              <p>地址：四川省成都市新都区新都大道8号</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;