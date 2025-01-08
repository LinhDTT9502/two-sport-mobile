import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import policy_bg from '../../../assets/images/policies.png';
import PolicySection from "./PolicySection";
import Header from "../../layouts/Header";

const { width } = Dimensions.get('window');

const PolicyPage = () => {
    const policies = [
        {
          title: "1. CHÍNH SÁCH XỬ LÍ KHIẾU NẠI",
          content: `a) Khiếu nại về sản phẩm và bảo hành
      - Áp dụng với khách hàng mua trực tiếp tại cửa hàng/chi nhánh: gửi sản phẩm cho chi nhánh và liên hệ trực tiếp hotline của chi nhánh đó để được xử lý nhanh chóng và hiệu quả.
      - Áp dụng với khách hàng mua trực tiếp tại website/ứng dụng mobile: liên hệ trực tiếp qua hotline xxxxxxx
      b) Khiếu nại về chất lượng phục vụ:
      - Khách hàng có nhu cầu khiếu nại về dịch vụ, vui lòng liên hệ trực tiếp hotline xxxxx hoặc quản lý của chi nhánh.`,
        },
        {
          title: "2. CHÍNH SÁCH ĐỔI TRẢ, HOÀN TIỀN",
          content: `- Trường hợp quý khách mua hàng trực tiếp tại chi nhánh, vui lòng liên hệ trực tiếp qua hotline chi nhánh để được hỗ trợ.
      - Trường hợp quý khách mua hàng qua website, vui lòng liên hệ trực tiếp qua hotline xxxxxx
      a) 2Sport cho phép quý khách được đổi/trả hàng trong những trường hợp sau
      - Trường hợp sản phẩm không vừa size:
      + Khách hàng có thể yêu cầu đổi/trả hàng khi sản phẩm không vừa ý trong vòng 1 ngày kể từ khi nhận hàng, 2Sport sẽ đổi sản phẩm cho khách. Sản phẩm muốn đổi/trả cần giữ nguyên hiện trạng, chưa sử dụng.
      - Sản phẩm mua bị lỗi, quá hạn sử dụng:
      + Quý khách vui lòng liên hệ trực tuyến thông qua kênh chat CSKH để lấy thêm thông tin sản phẩm. Sau đó, quý khách vui lòng kiểm tra sản phẩm trước khi thanh toán. Trong trường hợp sản phẩm bị lỗi do nhà sản xuất, hoặc bị hư hại trong quá trình vận chuyển làm ảnh hưởng đến ngoại hình và tính năng của sản phẩm, quý khách vui lòng từ chối nhận hàng và gửi lại sản phẩm cho chúng tôi.
      - Sản phẩm không sử dụng được ngay khi được giao:
      + Quý khách vui lòng đọc kỹ hoặc tìm hiểu hướng dẫn sử dụng và chắc rằng sản phẩm phù hợp với nhu cầu của bạn. Quý khách có thể liên hệ với 2Sport để được hướng dẫn sử dụng sản phẩm. Trong trường hợp sản phẩm không đáp ứng được như cầu của quý khách, quý khách vui lòng phản hồi lại với 2Sport và gửi trả sản phẩm lại cho chúng tôi.
      - Sản phẩm giao không đúng theo đơn đặt hàng:
      + Nếu sản phẩm giao đến không đúng với đơn hàng quý khách đã đặt, quý khách vui lòng liên hệ lại với 2Sport để xác nhận lại đơn đặt hàng. Trong trường hợp lỗi do sai sót từ phía cửa hàng, 2Sport sẽ tiến hành đổi/trả sản phẩm cho quý khách.
      b) Điều kiện đổi trả hàng
      - Thời gian yêu cầu đổi/trả: trong vòng 36 giờ tính từ thời điểm nhận được hàng và phải liên hệ gọi ngay cho chúng tôi theo hotline để được xác nhận đổi trả hàng.
      - Điều kiện:
      + Sản phẩm gửi lại phải còn nguyên đai nguyên kiện.
      + Phiếu bảo hành (nếu có) và tem của công ty trên sản phẩm còn nguyên vẹn.
      + Sản phẩm đổi/ trả phải còn đầy đủ hộp, chưa qua sử dụng.
      + Quý khách chịu chi phí vận chuyển, đóng gói (đối với sản phẩm đổi size).
      c) Quy trình đổi trả
      - Đối với khách mua hàng trực tiếp tại cửa hàng:
      Quý khách cần kiểm tra kỹ sản phẩm trước khi thanh toán. Trường hợp mua làm quà tặng, đổi size thì mang trực tiếp tới cửa hàng mua để được nhân viên ở shop hỗ trợ.
      - Đối với khách hàng mua online tại Website/ứng dụng mobile:
      + Quý khách hàng được phép kiểm tra hàng trước khi nhận (được đồng kiểm tra sản phẩm với shipper giao hàng). Trong trường hợp phát hiện lỗi, không đúng với mô tả hoặc hình ảnh trên website, quý khách trả hàng trực tiếp cho shipper và vui lòng liên hệ ngay với 2Sport để yêu cầu đổi/trả hàng.
      + Trường hợp sau khi nhân viên giao hàng đã đi – Nếu muốn đổi trả hàng có thể liên hệ với chúng tôi qua hotline để được xử lý và hẹn lịch đổi trả hàng.`,
        },
        {
          title: "3. CHÍNH SÁCH THANH TOÁN",
          content: `- Thanh toán trực tiếp khi mua hàng tại Shop hoặc qua trung gian vận chuyển.
      + Địa chỉ cửa hàng: xxxx, Thủ Đức, TP HCM
      - Thanh toán qua hình thức chuyển khoản
      + Liên hệ để được hướng dẫn chi tiết về thông tin của từng chi nhánh còn hàng, phương thức thanh toán và các thông tin chi tiết khác`,
        },
        {
          title: "4. CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG",
          content: `1. Mục đích và phạm vi thu thập thông tin
      Website: 2Sport.com/ không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng thu thập trên trang web cho một bên thứ ba nào khác. Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công ty.
      Khi bạn liên hệ đăng ký dịch vụ, thông tin cá nhân mà 2Sport.com thu thập bao gồm:
      - Họ và tên
      - Địa chỉ
      - Điện thoại
      - Email
      Ngoài thông tin cá nhân là các thông tin về dịch vụ:
      - Tên sản phẩm
      - Số lượng
      - Thời gian giao nhận sản phẩm
      2. Phạm vi sử dụng thông tin
      Thông tin cá nhân thu thập được sẽ chỉ được 2Sport.com sử dụng trong nội bộ công ty và cho một hoặc tất cả các mục đích sau đây:
      - Hỗ trợ khách hàng.
      - Cung cấp thông tin liên quan đến dịch vụ.
      - Xử lý đơn đặt hàng và cung cấp dịch vụ và thông tin qua trang web của chúng tôi theo yêu cầu của bạn.
      - Chúng tôi có thể sẽ gửi thông tin sản phẩm, dịch vụ mới, thông tin về các sự kiện sắp tới hoặc thông tin tuyển dụng nếu quý khách đăng kí nhận email thông báo.
      - Ngoài ra, chúng tôi sẽ sử dụng thông tin bạn cung cấp để hỗ trợ quản lý tài khoản khách hàng; xác nhận và thực hiện các giao dịch tài chính liên quan đến các khoản thanh toán trực tuyến của bạn.
      3. Thời gian lưu trữ thông tin
      Thông tin cá nhân của khách hàng sẽ được lưu trữ cho đến khi khách hàng có yêu cầu hủy bỏ hoặc khách hàng tự đăng nhập và thực hiện hủy bỏ. Trong mọi trường hợp thông tin cá nhân của khách hàng sẽ được bảo mật trên máy chủ của 2Sport.com
      4. Không Chia Sẻ Thông Tin Cá Nhân Khách Hàng
      Chính sách bảo mật của 2Sport sẽ không cung cấp thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào, trừ một số hoạt động cần thiết dưới đây:
      - Các đối tác là bên cung cấp dịch vụ cho chúng tôi liên quan đến thực hiện đơn hàng và chỉ giới hạn trong phạm vi thông tin cần thiết cũng như áp dụng các quy định đảm bảo an ninh, bảo mật các thông tin cá nhân.
      - Chúng tôi có thể sử dụng dịch vụ từ một nhà cung cấp dịch vụ là bên thứ ba để thực hiện một số hoạt động liên quan đến website 2Sport và khi đó bên thứ ba này có thể truy cập hoặc xử lý các thông tin cá nhân trong quá trình cung cấp các dịch vụ đó. Chúng tôi yêu cầu các bên thứ ba này tuân thủ mọi luật lệ về bảo vệ thông tin cá nhân liên quan và các yêu cầu về an ninh liên quan đến thông tin cá nhân.
      - Yêu cầu pháp lý: Chúng tôi có thể tiết lộ các thông tin cá nhân nếu điều đó do luật pháp yêu cầu và việc tiết lộ như vậy là cần thiết một cách hợp lý để tuân thủ các quy trình pháp lý.
      - Chuyển giao kinh doanh (nếu có): trong trường hợp sáp nhập, hợp nhất toàn bộ hoặc một phần với công ty khác, nhượng quyền kinh doanh người mua sẽ có quyền truy cập thông tin được chúng tôi lưu trữ, duy trì trong đó bao gồm cả thông tin cá nhân.
      5. Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân
      2Sport shop:
      - Địa chỉ cửa hàng chính: tp Thủ Đức, Tp Hồ Chí Minh
      - Địa chỉ cửa hàng chi nhánh: Q1, Q2, Q3,..., Tp Thủ Đức, Tp Hồ Chí Minh
      - Điện thoại: 077.685.XXX – 0906 XXX 883 – 079 77 XXXXX
      - Email: 2sportteam@gmail.com
      6. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu cá nhân của mình.
      – Khách hàng có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân của mình bằng cách liên hệ với ban quản trị website của công ty thực hiện việc này.
      – Khách hàng có quyền gửi khiếu nại về việc bị lộ thông tin cá nhân đến Ban quản trị của website của công ty. Khi tiếp nhận những phản hồi này, công ty sẽ xác nhận lại thông tin, trường hợp đúng như phản ánh của khách hàng tùy theo mức độ, công ty sẽ có những biện pháp xử lý kịp thời.
      7. Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo.
      Tại 2Sport.com, việc bảo vệ thông tin cá nhân của bạn là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng tôi sẽ được bảo mật. 2Sport.com cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác. 2Sport.com cam kết chỉ sử dụng các thông tin của bạn vào các trường hợp sau:
      - Nâng cao chất lượng dịch vụ dành cho khách hàng.
      - Giải quyết các tranh chấp, khiếu nại.
      - Khi cơ quan pháp luật có yêu cầu.
      2Sport.com hiểu rằng quyền lợi của bạn trong việc bảo vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo mật của 2Sport.com, và liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo vui lòng liên hệ qua số hotline 0338xxxxx hoặc email: 2sportteam@gmail.com.`,
        },
        {
          title: "5. CHÍNH SÁCH DÀNH CHO MEMBERSHIP KHI THUÊ ĐỒ TẠI 2SPORT",
          content: `THẺ SILVER - 3,000,000 vnd
      Quyền lợi:
      - Áp dụng giảm 15% tất cả các đơn hàng có sẵn.
      - Khách hàng được ưu tiên cập nhật các mẫu mới mà không cần trả thêm phí.
      - Hỗ trợ thêm ngày trong trường hợp thuê từ 3 sản phẩm trở lên trong 1 lần thuê.
      - Giảm 50% phí cọc (áp dụng cho sản phẩm dưới 400k).
      Lưu ý: Thẻ không được hoàn lại trong bất kỳ hoàn cảnh nào và có giá trị sử dụng 1 năm kể từ ngày phát hành.
      THẺ GOLD - 5,000,000 vnd
      Quyền lợi:
      - Áp dụng giảm 20% tất cả các đơn hàng có sẵn.
      - Khách hàng được ưu tiên cập nhật các mẫu mới mà không cần trả thêm phí.
      - Hỗ trợ thêm ngày trong trường hợp thuê từ 3 sản phẩm trở lên trong 1 lần thuê.
      - Giảm 50% phí cọc (áp dụng cho sản phẩm trên và dưới 400k).
      Lưu ý: Thẻ không được hoàn lại trong bất kỳ hoàn cảnh nào và có giá trị sử dụng 1 năm kể từ ngày phát hành.
      THẺ DIAMOND - 10,000,000 vnd
      Quyền lợi:
      - Áp dụng giảm 25% tất cả các đơn hàng có sẵn.
      - Không cần phải cọc khi thuê đồ (áp dụng cho sản phẩm có sẵn).
      - Khách hàng được ưu tiên cập nhật các mẫu mới mà không cần trả thêm phí.
      - Hỗ trợ thêm ngày trong trường hợp thuê từ 3 sản phẩm trở lên trong 1 lần thuê.
      Lưu ý: Thẻ không được hoàn lại trong bất kỳ hoàn cảnh nào và có giá trị sử dụng 1 năm kể từ ngày phát hành.`,
        },
        {
          title: "6. CHÍNH SÁCH KHI THUÊ ĐỒ SECOND HAND TẠI 2SPORT",
          content: `Để đảm bảo quyền lợi của khách hàng và bảo vệ chất lượng sản phẩm, 2Sport áp dụng các điều kiện và quy định đối với dịch vụ thuê đồ thể thao second-hand như sau:
      1. Đặt cọc sản phẩm: Khách hàng cần đặt cọc 50% giá trị mua của sản phẩm.
      2. Phí thuê sản phẩm: Tùy theo loại sản phẩm và thời gian thuê.
      3. Trách nhiệm bảo quản sản phẩm: Khách hàng chịu trách nhiệm bảo quản sản phẩm.
      4. Phí dịch vụ: Cộng thêm 50k hoặc 100k phí dịch vụ tùy theo giá trị sản phẩm.
      5. Giao nhận sản phẩm: Khách hàng có thể nhận hàng trực tiếp tại cửa hàng hoặc chọn dịch vụ giao hàng tận nơi. Phí vận chuyển sẽ tính riêng tùy khu vực.
      6. Thời gian thuê và trả sản phẩm: Thời gian thuê mặc định là 7 ngày, khách hàng có thể gia hạn thêm nếu có nhu cầu.
      7. Hỗ trợ khách hàng: 2Sport cam kết hỗ trợ khách hàng trong suốt quá trình sử dụng dịch vụ.`,
        },
        {
          title: "7. CHÍNH SÁCH VẬN CHUYỂN",
          content: `1. Phạm vi vận chuyển: Toàn quốc.
      2. Các hình thức giao hàng:
      a) Giao hàng nhanh: Áp dụng cho khách hàng gần.
      b) Giao hàng qua Ship COD: Áp dụng trên toàn quốc.
      3. Trách nhiệm đối với hàng hóa vận chuyển: Dịch vụ vận chuyển chịu trách nhiệm với hàng hóa và các rủi ro trong quá trình vận chuyển.`,
        },
      ];
      

  return (
    <ScrollView style={styles.container}>
        <Header/>
      <View style={styles.bannerContainer}>
        <Image source={policy_bg} style={styles.bannerImage} />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerText}>Policies</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.header}>Chính sách 2Sport</Text>
        {policies.map((policy, index) => (
          <PolicySection key={index} title={policy.title} content={policy.content} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 30,
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
    marginBottom:30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E6E6FA",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionContent: {
    padding: 16,
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});

export default PolicyPage;
