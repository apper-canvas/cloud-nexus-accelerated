import { useState, useEffect } from "react";
import { companyService } from "@/services/api/companyService";

const CompanySelector = ({ value, onChange, error, required = false, placeholder = "Select company" }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const options = await companyService.getCompanyOptions();
        setCompanies(options);
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedCompany = companies.find(c => c.value === parseInt(selectedValue));
    onChange({
      target: {
        name: 'company',
        value: selectedCompany ? selectedCompany.label : ''
      }
    });
  };

  const selectedCompany = companies.find(c => c.label === value);

  return (
    <select
      value={selectedCompany ? selectedCompany.value : ''}
      onChange={handleChange}
      disabled={loading}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
        error ? 'border-error' : ''
      }`}
    >
      <option value="">{loading ? "Loading companies..." : placeholder}</option>
      {companies.map((company) => (
        <option key={company.value} value={company.value}>
          {company.label}
        </option>
      ))}
    </select>
  );
};

export default CompanySelector;