"use client";

import React, { useState } from "react";
import axios from "axios";
import Select, { GroupBase, OptionsOrGroups } from "react-select";

import { rankOptions } from "@/data/rankOptions";
import { departmentOptions } from "@/data/departmentOptions";

export type UserInfo = {
  id: number;
  rank: string;
  name: string;
  department: string;
  division: string;
  score: number;
};

type UserInfoFormProps = {
  onSubmit: (userInfo: UserInfo) => void;
};

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [rank, setRank] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [division, setDivision] = useState("");

  const [error, setError] = useState("");

  type SelectOption = { value: string; label: string };
  type SelectGroup = GroupBase<SelectOption>;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // handle submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rank || !name || !department) {
      setError("กรุณากรอกคำนำหน้า/ยศ, ชื่อ-สกุล และเลือกสังกัด ให้ครบถ้วน");
      return;
    }
    setError("");

    const userInfo = { rank, name, department, division, score: 0 };
    try {
      const response = await axios.post(`${apiBaseUrl}/guest-user`, userInfo);
      onSubmit({ ...userInfo, id: response.data.id });
    } catch (error) {
      console.error("Error submitting user info:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-lg bg-white rounded-lg shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          ลงทะเบียนทำแบบทดสอบ
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คำนำหน้า/ยศ
          </label>
          <Select
          instanceId="rankSelect"
            options={rankOptions as OptionsOrGroups<SelectOption, SelectGroup>}
            isSearchable={true}
            placeholder="-- เลือกคำนำหน้า --"
            value={
              rank
                ? // หาค่า value ปัจจุบันใน options (กรณีแก้ไขหรือหลังเลือก)
                  {
                    value: rank,
                    label: rank,
                  }
                : null
            }
            onChange={(selectedOption) => {
              // selectedOption จะเป็น { value: string, label: string } | null
              if (selectedOption) {
                setRank(selectedOption.value);
              } else {
                setRank("");
              }
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อ-สกุล
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ชื่อ-สกุล"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สังกัด/กอง
          </label>
          <Select
          instanceId="departmentSelect"
            options={departmentOptions as OptionsOrGroups<SelectOption, SelectGroup>}
            isSearchable={true}
            placeholder="-- เลือกสังกัด --"
            value={
              department
                ? {
                    value: department,
                    label: department,
                  }
                : null
            }
            onChange={(selectedOption) => {
              if (selectedOption) {
                setDepartment(selectedOption.value);
              } else {
                setDepartment("");
              }
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            แผนก
          </label>
          <input
            type="text"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            placeholder="แผนก"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div className="mt-6 text-center">
        {error && <div className="mt-4 text-center text-red-500">{error}</div>}
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ทำแบบทดสอบ
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;
