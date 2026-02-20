import { useNavigate } from "react-router-dom";

export function useNavigateDashboard() {
  const navigate = useNavigate();

  return (route: string) => {
    switch (route) {
      case 'home':
        navigate('/dashboard/')
        break;
      case 'clients':
        navigate('/dashboard/clients');
        break;
      case 'lists':
        navigate('/dashboard/lists');
        break;
      case 'deals':
        navigate('/dashboard/deals');
        break;
      case 'cards':
        navigate('/dashboard/cards');
        break;
      case 'eSign':
        navigate('/dashboard/signing');
        break;
      case 'calculator':
        navigate('/dashboard/calculator');
        break;
    }
  };
}
