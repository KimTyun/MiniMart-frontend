import React, { useState } from 'react'

const styles = {
   container: { maxWidth: '1000px', margin: '2rem auto', padding: '0 2rem', fontFamily: 'sans-serif' },
   title: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' },
   tabContainer: { display: 'flex', marginBottom: '2rem' },
   tabButton: { padding: '1rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
   activeTab: { color: 'black', background: '#d4d4d4eb' },
   // FAQ 아코디언 스타일
   faqItem: { border: '1px solid #eee', borderRadius: '8px', marginBottom: '0.5rem' },
   faqQuestion: { padding: '1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' },
}

const noticesData = [
   { id: 1, title: '미니마트 시스템 점검 안내 (08/15 02:00 ~ 04:00)', date: '2025-08-14' },
   { id: 2, title: '추석 연휴 배송 지연 안내', date: '2025-08-12' },
   { id: 3, title: '개인정보처리방침 개정 안내', date: '2025-08-01' },
]

const faqData = [
   { q: '배송은 얼마나 걸리나요?', a: '영업일 기준 2~3일 소요됩니다. 주문량이 많은 경우 하루 이틀 지연될 수 있습니다.' },
   { q: '교환/반품 정책은 어떻게 되나요?', a: '상품 수령 후 7일 이내에 신청 가능하며, 제품의 택이 제거되지 않은 상태여야 합니다.' },
   { q: '회원가입은 어떻게 하나요?', a: '우측 상단의 로그인 버튼을 클릭하여 회원가입 페이지로 이동할 수 있습니다.' },
]

const Notices = () => (
   <div>
      {noticesData.map((notice) => (
         <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
            <span>{notice.title}</span>
            <span style={{ color: '#888' }}>{notice.date}</span>
         </div>
      ))}
   </div>
)

const FAQ = () => (
   <div>
      {faqData.map((item, index) => (
         <details key={index} style={styles.faqItem}>
            <summary style={styles.faqQuestion}>
               <span>{item.q}</span>
               <span>▼</span>
            </summary>
            <div style={{ padding: '1rem', color: '#555', lineHeight: '1.6' }}>{item.a}</div>
         </details>
      ))}
   </div>
)

export default function CustomerService() {
   const [activeTab, setActiveTab] = useState('notices')

   const renderContent = () => {
      if (activeTab === 'faq') return <FAQ />
      if (activeTab === 'qna') return <QnA />
      return <Notices />
   }

   return (
      <div style={styles.container}>
         <h1 style={styles.title}>고객센터</h1>
         <div style={styles.tabContainer}>
            <button style={{ ...styles.tabButton, ...(activeTab === 'notices' && styles.activeTab) }} onClick={() => setActiveTab('notices')}>
               공지사항
            </button>
            <button style={{ ...styles.tabButton, ...(activeTab === 'faq' && styles.activeTab) }} onClick={() => setActiveTab('faq')}>
               자주 묻는 질문
            </button>
         </div>
         <div>{renderContent()}</div>
      </div>
   )
}
