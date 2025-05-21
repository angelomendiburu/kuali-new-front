import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { RiUserLine } from "react-icons/ri";
import { toast } from 'sonner';

export default function UserMenu() {
  const navigate = useNavigate();
  const [leadCount, setLeadCount] = useState(0);
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    fetchLeadCount();
  }, []);

  const fetchLeadCount = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/leads', {
        credentials: 'include'
      });
      const leads = await response.json();
      setLeadCount(leads.length);
    } catch (error) {
      console.error('Error fetching lead count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3003/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Limpiar localStorage
      localStorage.clear();
      
      // Mostrar toast de éxito
      toast.success('Sesión cerrada correctamente');
      
      // Redireccionar a login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-flex items-center gap-2 px-2 py-1 text-sm rounded-md hover:bg-accent cursor-pointer">
          <RiUserLine className="w-4 h-4" />
          <span>{userName}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between">
          Leads totales <span className="font-semibold">{leadCount}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          Rol <span className="font-semibold capitalize">{userRole}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
