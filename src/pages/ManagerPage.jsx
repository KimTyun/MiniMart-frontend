import { Routes, Route } from 'react-router-dom'
import Select from '../components/manager/Select'
import ManagerAllow from '../components/manager/ManagerAllow'
import ManagerProduct from '../components/manager/ManagerProduct'
import ManagerStatistics from '../components/manager/managerStatistics'
import ManagerQnA from '../components/manager/ManagerQna'

export default function ManagerPage() {
   return (
      <>
         <Select />
         <Routes>
            <Route index element={<ManagerAllow />} />
            <Route path="product" element={<ManagerProduct />} />
            <Route path="statistics" element={<ManagerStatistics />} />
            <Route path="qna" element={<ManagerQnA />} />
         </Routes>
      </>
   )
}
