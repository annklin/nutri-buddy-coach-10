package app.lovable.aa1646eb938b483d941bdc95db20b728;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    MobileAds.initialize(this);
  }

}
