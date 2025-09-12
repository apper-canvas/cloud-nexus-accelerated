import { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";

const CompanyList = ({ companies, onDeleteCompany }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.relationshipStage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    
    if (sortDirection === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="h-4 w-4" />;
    }
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="h-4 w-4" />
      : <ApperIcon name="ArrowDown" className="h-4 w-4" />;
  };

  const getRelationshipColor = (stage) => {
    switch (stage) {
      case "Active Client": return "success";
      case "Prospect": return "warning";
      case "Lead": return "info";
      case "Partner": return "primary";
      case "Former Client": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600">
            Manage company profiles and relationships
          </p>
        </div>
        <Link to="/companies/new">
          <Button>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search companies..."
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredCompanies.length} of {companies.length} companies
          </div>
        </div>

        {sortedCompanies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Building" className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No companies found" : "No companies yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No companies match "${searchTerm}". Try a different search term.`
                : "Get started by adding your first company."
              }
            </p>
            {!searchTerm && (
              <Link to="/companies/new">
                <Button>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add Your First Company
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Company</span>
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("industry")}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Industry</span>
                      {getSortIcon("industry")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("size")}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Size</span>
                      {getSortIcon("size")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("location")}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Location</span>
                      {getSortIcon("location")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort("relationshipStage")}
                      className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Relationship</span>
                      {getSortIcon("relationshipStage")}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <span className="text-sm font-medium text-gray-700">Contacts</span>
                  </th>
                  <th className="text-right py-3 px-4">
                    <span className="text-sm font-medium text-gray-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCompanies.map((company) => (
                  <tr key={company.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <Link to={`/companies/${company.Id}`} className="block">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center mr-3">
                            <ApperIcon name="Building" className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 hover:text-primary">
                              {company.name}
                            </div>
                            {company.website && (
                              <div className="text-xs text-gray-500">
                                {company.website}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{company.industry}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{company.size} employees</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{company.location}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge color={getRelationshipColor(company.relationshipStage)}>
                        {company.relationshipStage}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">{company.contactCount}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/companies/${company.Id}`}>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Eye" className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/companies/${company.Id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteCompany(company.Id)}
                          className="text-error hover:text-error hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompanyList;