import { useAuthStore } from "@/store/useAuthStore"

const NavBar = () => {
    const { authUser } = useAuthStore()

    return <div>NavBar Component</div>
}

export default NavBar
