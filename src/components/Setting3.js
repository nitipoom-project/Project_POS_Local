import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import '../output.css';
import Adduser from '../setting/Manageuser';
import { MdSettings, MdManageAccounts } from 'react-icons/md'
import { FcPortraitMode } from "react-icons/fc";

import Showusers from '../setting/Showusers';
import Shopdata from '../setting2/Shopdata';
import Managepayment from '../setting3/Managepayment';

function Setting3() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mx-auto mt-8">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-8 flex items-center justify-center">
        &nbsp;<MdSettings />
        การตั้งค่าการชำระเงิน
      </h2>
      <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-6">
      </h2>
      <div className='mt-8' style={{ width: '100%' }}><Managepayment /></div>
    </div>
  );
}

export default Setting3;